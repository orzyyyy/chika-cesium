import Cesium from "cesium";

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

    if (options.drawPoints) {
      options.drawPoints(viewer);
    }

    viewer.scene.primitives
      .add(
        new Cesium.Cesium3DTileset({
          url: "../mock/3dtileout/tileset.json",
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
        console.log(error);
      });
  }

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
