import Cesium from 'cesium';
import Model, { ModelOptions } from '../tools/model';

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

export type PointType = 'pin' | 'text' | 'none' | undefined;
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
      model?: ModelOptions;
      pointDatas?: Array<any>;
      modelPaths?: Array<string>;
      onClick?: (name: string, position: any, pick: any) => void;
      onHover?: (name: string, position: any, pick: any) => void;
      polygon?: Array<CommonItem>;
      line?: Array<CommonItem>;
      onMount?: (instance: Trunk) => void;
    },
  ) {
    const viewer = new Cesium.Viewer(root, defaultViewerOptions);
    (viewer as any)._cesiumWidget._creditContainer.style.display = 'none';

    if (options) {
      if (options.model) {
        new Model(viewer, options.model);
      }
      if (options.dev) {
        this.consoleCoordinate(viewer);
      }
      if (options.pointDatas) {
        this.drawPoints(viewer, options.pointDatas);
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
      if (options.onMount) {
        options.onMount(this);
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

    const makeProperty = (entity: Cesium.Entity, color: Cesium.Color) => {
      const colorProperty: any = new Cesium.CallbackProperty((_, result) => {
        if (pickedEntities.contains(entity)) {
          return Cesium.Color.YELLOW.withAlpha(0.5).clone(result);
        }
        return color.clone(result);
      }, false);
      entity.polygon.material = new Cesium.ColorMaterialProperty(colorProperty);
    };
    const pickedEntities = new (Cesium as any).EntityCollection();
    handler.setInputAction(({ endPosition }: any) => {
      const drillPick = viewer.scene.drillPick(endPosition);
      if (Cesium.defined(drillPick)) {
        pickedEntities.removeAll();
        for (let i = 0; i < drillPick.length; i++) {
          const entity = drillPick[i].id;
          if (entity) {
            makeProperty(entity, Cesium.Color.RED.withAlpha(0.5));
            pickedEntities.add(entity);
          }
        }
      }

      if (callback) {
        const pick = viewer.scene.pick(endPosition);
        if (Cesium.defined(pick) && pick && pick.id) {
          callback(pick.id!._customData, endPosition, pick);
        } else {
          callback(null, endPosition, pick);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
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
      } else if (type === 'none' || !type) {
      }
    }
  };

  drawPolygon = (viewer: any, polygon: Array<CommonItem>) => {
    let centers = [];
    for (let item of polygon) {
      let result = [];
      const { dataSource, id, color } = item;
      // handle with coordinates
      // { lng, lat } => [lng, lat]
      for (let item of dataSource) {
        const { lng, lat } = item;
        result.push(lng);
        result.push(lat);
      }
      viewer.entities.add({
        customData: item,
        name: id || 'undefined polygon name',
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray(result),
          material: this.formatColor(color),
        },
      });
      centers.push(this.getCenterPointFromCoordinates(item));
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
          material: this.formatColor(color),
        },
      });
    }
  };

  private formatColor = (color: string | undefined) => {
    let material: Cesium.Color | string | undefined = color;
    if (!color) {
      material = Cesium.Color.TRANSPARENT;
    } else if (color) {
      material = Cesium.Color.fromCssColorString(color);
    }
    return material;
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
