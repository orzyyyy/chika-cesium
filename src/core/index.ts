import Cesium from 'cesium';

const defaultViewerOptions = {
  animation: false,
  vrButton: false,
  geocoder: false,
  infoBox: false,
  sceneModePicker: false,
  // selectionIndicator: false,
  timeline: false,
  navigationHelpButton: false,
  scene3DOnly: false,
  homeButton: false,
  navigationInstructionsInitiallyVisible: false,
  fullscreenButton: false,
};

export default class Trunk {
  viewer: any;

  constructor(root: string | Element, options?: any) {
    const viewer = new Cesium.Viewer(root, defaultViewerOptions);
    const imageryProviderViewModels =
      viewer.baseLayerPicker.viewModel.imageryProviderViewModels;
    viewer.baseLayerPicker.viewModel.selectedImagery =
      imageryProviderViewModels[6];

    if ('dev' in options) {
      this.consoleCoordinate(viewer);
    }
    if ('pointDatas' in options) {
      this.drawPoints(viewer, options.pointDatas);
    }
    if ('modelPaths' in options) {
      this.loadModals(viewer, options.modelPaths);
    }
    if ('onClick' in options) {
      this.bindClickEvent(viewer, options.onClick);
    }
    if ('polygon' in options) {
      this.drawPolygon(viewer, options.polygon);
    }
    this.viewer = viewer;
  }

  bindClickEvent = (viewer: any, callback?: Function) => {
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((click: any) => {
      const pick = viewer.scene.pick(click.position);
      if (pick && pick.id && callback) {
        callback(pick.id.name);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  };

  loadModals = (viewer: any, paths: Array<string>) => {
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

  getCenterPointFromCoordinates = ({
    dataSource,
    name,
    id,
  }: {
    dataSource: Array<{
      lng: number;
      lat: number;
    }>;
    name?: string;
    id?: string;
  }) => {
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
      name,
      id,
    };
  };

  drawPoints = (viewer: any, dataSource: Array<any>) => {
    const pinBuilder = new Cesium.PinBuilder();
    for (let item of dataSource) {
      const { lng, lat, id, name } = item;
      viewer.entities.add({
        name: id,
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
    }
  };

  drawPolygon = (
    viewer: any,
    polygon: Array<{
      dataSource: Array<{ lng: number; lat: number }>;
      name?: string;
      color?: string;
    }>,
  ) => {
    let centers = [];
    for (let polygonItem of polygon) {
      let result = [];
      const { dataSource, name, color } = polygonItem;
      // handle with coordinates
      // { lng, lat } => [lng, lat]
      for (let item of dataSource) {
        const { lng, lat } = item;
        result.push(lng);
        result.push(lat);
      }
      viewer.entities.add({
        name: name || 'undefined polygon name',
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray(result),
          material:
            (color && Cesium.Color.fromCssColorString(color)) ||
            Cesium.Color.CHOCOLATE,
        },
      });
      centers.push(this.getCenterPointFromCoordinates(polygonItem));
    }
    this.drawPoints(viewer, centers);
  };

  consoleCoordinate = (viewer: any) => {
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
