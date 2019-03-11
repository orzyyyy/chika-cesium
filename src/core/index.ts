import Cesium from 'cesium';

const defaultViewerOptions = {
  animation: false,
  vrButton: false,
  geocoder: false,
  infoBox: false,
  sceneModePicker: false,
  selectionIndicator: false,
  timeline: false,
  navigationHelpButton: false,
  scene3DOnly: false,
  homeButton: false,
  navigationInstructionsInitiallyVisible: false,
  fullscreenButton: false,
  baseLayerPicker: false,
};

type PointType = 'pin' | 'text' | 'none' | undefined;
type TableItem = {
  columns: Array<{ key: string; name: string }>;
  dataSource: Array<any>;
};
type CommonItem = {
  dataSource: Array<{
    lng: number;
    lat: number;
    height?: number;
  }>;
  name?: string;
  id?: string;
  color?: string;
  type?: PointType;
  table?: TableItem;
  width?: number | string;
};

export default class Trunk {
  viewer: any;

  constructor(
    root: string | Element,
    options?: {
      dev?: boolean;
      pointDatas?: Array<any>;
      modelPaths?: Array<string>;
      onClick?: (name: string, position: any, pick: any) => void;
      onHover?: (name: string, position: any, pick: any) => void;
      polygon?: Array<CommonItem>;
      line?: Array<CommonItem>;
    },
  ) {
    const viewer = new Cesium.Viewer(root, defaultViewerOptions);
    (viewer as any)._cesiumWidget._creditContainer.style.display = 'none';

    if (options) {
      if (options.dev) {
        this.consoleCoordinate(viewer);
      }
      if (options.pointDatas) {
        this.drawPoints(viewer, options.pointDatas);
      }
      if (options.modelPaths) {
        this.loadModels(viewer, options.modelPaths);
      }
      if (options.onClick) {
        this.bindClickEvent(viewer, options.onClick);
      }
      if (options.onHover) {
        this.bindHoverEvent(viewer, options.onHover);
      }
      if (options.polygon) {
        this.drawPolygon(viewer, options.polygon);
      }
      if (options.line) {
        this.drawLine(viewer, options.line);
      }
    }
    this.viewer = viewer;
    return this;
  }

  private bindClickEvent = (viewer: any, callback?: Function) => {
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(({ position }: any) => {
      const pick = viewer.scene.pick(position);
      if (pick && pick.id && callback) {
        callback(pick.id, position, pick);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  };

  private bindHoverEvent = (viewer: any, callback?: Function) => {
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(({ endPosition }: any) => {
      const pick = viewer.scene.pick(endPosition);
      if (callback) {
        if (Cesium.defined(pick) && pick && pick.id) {
          callback(pick.id!._customData, endPosition, pick);
        } else {
          callback(null, endPosition, pick);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  };

  private loadModels = (viewer: any, paths: Array<string>) => {
    for (let url of paths) {
      viewer.scene.primitives
        .add(
          new Cesium.Cesium3DTileset({
            url,
            maximumScreenSpaceError: 2,
            maximumNumberOfLoadedTiles: 1000,
          }),
        )
        .readyPromise.then((tileset: any) => {
          const boundingSphere = tileset.boundingSphere;
          viewer.camera.viewBoundingSphere(
            boundingSphere,
            new Cesium.HeadingPitchRange(0.0, -0.5, boundingSphere.radius),
          );
          viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
        })
        .otherwise((error: any) => {
          console.error(error);
        });
    }
  };

  private getCenterPointFromCoordinates = ({
    dataSource,
    ...rest
  }: CommonItem) => {
    const total = dataSource.length;
    let totalLng = 0;
    let totalLat = 0;
    for (let { lng, lat } of dataSource) {
      totalLng += lng;
      totalLat += lat;
    }
    return {
      lng: totalLng / total,
      lat: totalLat / total,
      ...rest,
    };
  };

  drawPoints = (viewer: any, dataSource: Array<any>) => {
    const pinBuilder = new Cesium.PinBuilder();
    for (let item of dataSource) {
      const { lng, lat, id, name, color, type } = item;
      if (type === 'text') {
        viewer.entities.add({
          name,
          position: Cesium.Cartesian3.fromDegrees(
            parseFloat(lng),
            parseFloat(lat),
            30,
          ),
          billboard: {
            image: pinBuilder
              .fromText(name, Cesium.Color.ORANGE, 100)
              .toDataURL(),
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            width: name.length * 40,
            height: name.length * 30,
          },
        });
      } else if (type === 'pin') {
        (Cesium as any).when(
          pinBuilder.fromMakiIconId(
            'building',
            Cesium.Color.fromCssColorString(color),
            60,
          ),
          (canvas: any) => {
            return viewer.entities.add({
              name: id,
              position: Cesium.Cartesian3.fromDegrees(
                parseFloat(lng),
                parseFloat(lat),
                30,
              ),
              billboard: {
                image: canvas.toDataURL(),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              },
            });
          },
        );
      } else if (type === 'none') {
      }
    }
  };

  drawPolygon = (viewer: any, polygon: Array<CommonItem>) => {
    let centers = [];
    for (let CommonItem of polygon) {
      let result = [];
      const { dataSource, id, color } = CommonItem;
      // handle with coordinates
      // { lng, lat } => [lng, lat]
      for (let item of dataSource) {
        const { lng, lat } = item;
        result.push(lng);
        result.push(lat);
      }
      viewer.entities.add({
        customData: CommonItem,
        name: id || 'undefined polygon name',
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray(result),
          material:
            (color && Cesium.Color.fromCssColorString(color)) ||
            Cesium.Color.CHOCOLATE,
        },
      });
      centers.push(this.getCenterPointFromCoordinates(CommonItem));
    }
    this.drawPoints(viewer, centers);
  };

  drawLine = (viewer: any, line: Array<CommonItem>) => {
    for (let lineItem of line) {
      let result = [];
      const { dataSource, id, color, width } = lineItem;
      // handle with coordinates
      // { lng, lat } => [lng, lat]
      for (let item of dataSource) {
        const { lng, lat, height } = item;
        result.push(lng);
        result.push(lat);
        if (height) {
          result.push(height);
        }
      }
      viewer.entities.add({
        name: id || 'undefined line name',
        polyline: {
          customData: lineItem,
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(result),
          width,
          arcType: (Cesium as any).ArcType.RHUMB,
          material:
            (color && Cesium.Color.fromCssColorString(color)) ||
            Cesium.Color.CHOCOLATE,
        },
      });
    }
  };

  private consoleCoordinate = (viewer: any) => {
    const canvas = viewer.scene.canvas;
    const ellipsoid = viewer.scene.globe.ellipsoid;
    const handler = new Cesium.ScreenSpaceEventHandler(canvas);
    handler.setInputAction((movement: any) => {
      const cartesian = viewer.camera.pickEllipsoid(
        movement.endPosition,
        ellipsoid,
      );
      if (cartesian) {
        const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(
          cartesian,
        );
        const latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(
          4,
        );
        const longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(
          4,
        );
        const altitude = (
          viewer.camera.positionCartographic.height / 1000
        ).toFixed(2);
        // eslint-disable-next-line
        console.log(longitude, latitude, altitude);
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  };
}
