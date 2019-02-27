import Cesium from 'cesium';

export default class Trunk {
  constructor(root: string | Element, options?: any) {
    const viewer = new Cesium.Viewer(root, options);

    viewer._cesiumWidget._creditContainer.style.display = 'none';

    const imageryProviderViewModels =
      viewer.baseLayerPicker.viewModel.imageryProviderViewModels;
    viewer.baseLayerPicker.viewModel.selectedImagery =
      imageryProviderViewModels[6];

    const canvas: any = viewer.scene.canvas;
    const ellipsoid = viewer.scene.globe.ellipsoid;
    const handler = new Cesium.ScreenSpaceEventHandler(canvas);
    handler.setInputAction((movement: any) => {
      const cartesian = viewer.camera.pickEllipsoid(
        movement.endPosition,
        ellipsoid,
      );
      if (cartesian) {
        viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    let tileset = viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url:
          'http://47.95.1.229:9097/Resources/宁波3DTiles/宁波3DTiles格式/NO1-3DTiles/Scene/NO1m3D_Tiles.json',
        maximumScreenSpaceError: 2,
        maximumNumberOfLoadedTiles: 1000,
      }),
    );

    tileset = viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url:
          'http://47.95.1.229:9097/Resources/宁波3DTiles/宁波3DTiles格式/NO2-3DTiles-2/Scene/NO2m3D_Tilesm2.json',
        maximumScreenSpaceError: 2,
        maximumNumberOfLoadedTiles: 1000,
      }),
    );

    tileset = viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url:
          'http://47.95.1.229:9097/Resources/宁波3DTiles/宁波3DTiles格式/NO3-3DTiles/Scene/NO3m3D_Tiles.json',
        maximumScreenSpaceError: 2,
        maximumNumberOfLoadedTiles: 1000,
      }),
    );

    tileset.readyPromise
      .then((tileset: any) => {
        const boundingSphere = tileset.boundingSphere;
        viewer.camera.viewBoundingSphere(
          boundingSphere,
          new Cesium.HeadingPitchRange(0.0, -0.5, boundingSphere.radius),
        );
        viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
      })
      .otherwise((error: any) => {
        console.log(error);
      });
  }
}
