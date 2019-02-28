import Cesium from "cesium";

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
  fullscreenButton: false
};

export default class Trunk {
  constructor(root: string | Element, options?: any) {
    const viewer = new Cesium.Viewer(root, defaultViewerOptions);
    const imageryProviderViewModels =
      viewer.baseLayerPicker.viewModel.imageryProviderViewModels;
    viewer.baseLayerPicker.viewModel.selectedImagery =
      imageryProviderViewModels[6];

    if (options.dev) {
      this.consoleCoordinate(viewer);
    }
    if (options.pointDatas) {
      this.drawPoints(viewer, options.pointDatas);
    }
    if (options.modalPaths) {
      this.loadModals(viewer, options.modalPaths);
    }
    if (options.onClick) {
      this.bindClickEvent(viewer, options.onClick);
    }
  }

  bindClickEvent = (viewer: any, callback?: any) => {
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
            maximumNumberOfLoadedTiles: 1000
          })
        )
        .readyPromise.then((tileset: any) => {
          const boundingSphere = tileset.boundingSphere;
          viewer.camera.viewBoundingSphere(
            boundingSphere,
            new Cesium.HeadingPitchRange(0.0, -0.5, boundingSphere.radius)
          );
          viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
        })
        .otherwise((error: any) => {
          console.error(error);
        });
    }
  };

  drawPoints = (viewer: any, datas: Array<any>) => {
    const pinBuilder = new Cesium.PinBuilder();
    for (let item of datas) {
      const { lng, lat, id, name } = item;
      viewer.entities.add({
        name: id,
        position: Cesium.Cartesian3.fromDegrees(
          parseFloat(lng),
          parseFloat(lat),
          30
        ),
        billboard: {
          image: pinBuilder
            .fromText(name, Cesium.Color.ORANGE, 100)
            .toDataURL(),
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        }
      });
    }
  };

  consoleCoordinate = (viewer: any) => {
    const canvas = viewer.scene.canvas;
    const ellipsoid = viewer.scene.globe.ellipsoid;
    const handler = new Cesium.ScreenSpaceEventHandler(canvas);
    handler.setInputAction((movement: any) => {
      const cartesian = viewer.camera.pickEllipsoid(
        movement.endPosition,
        ellipsoid
      );
      if (cartesian) {
        const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(
          cartesian
        );
        const latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(
          4
        );
        const longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(
          4
        );
        const altitude = (
          viewer.camera.positionCartographic.height / 1000
        ).toFixed(2);
        console.log(longitude, latitude, altitude);
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  };
}
