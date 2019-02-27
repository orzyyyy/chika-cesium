import Cesium from "cesium";
import { ajax } from "../urlHelper";

export default class Trunk {
  constructor(root: string | Element, options?: any) {
    const viewer = new Cesium.Viewer(root, options);
    const imageryProviderViewModels =
      viewer.baseLayerPicker.viewModel.imageryProviderViewModels;
    viewer.baseLayerPicker.viewModel.selectedImagery =
      imageryProviderViewModels[6];
    const canvas = viewer.scene.canvas;
    const ellipsoid = viewer.scene.globe.ellipsoid;
    const handler = new Cesium.ScreenSpaceEventHandler(canvas);
    handler.setInputAction((movement: any) => {
      const cartesian = viewer.camera.pickEllipsoid(
        movement.endPosition,
        ellipsoid
      );
      if (cartesian) {
        viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url:
          "http://47.95.1.229:9097/Resources/宁波3DTiles/宁波3DTiles格式/NO1-3DTiles/Scene/NO1m3D_Tiles.json",
        maximumScreenSpaceError: 2,
        maximumNumberOfLoadedTiles: 1000
      })
    );

    viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url:
          "http://47.95.1.229:9097/Resources/宁波3DTiles/宁波3DTiles格式/NO2-3DTiles-2/Scene/NO2m3D_Tilesm2.json",
        maximumScreenSpaceError: 2,
        maximumNumberOfLoadedTiles: 1000
      })
    );

    viewer.scene.primitives
      .add(
        new Cesium.Cesium3DTileset({
          url:
            "http://47.95.1.229:9097/Resources/宁波3DTiles/宁波3DTiles格式/NO3-3DTiles/Scene/NO3m3D_Tiles.json",
          maximumScreenSpaceError: 2,
          maximumNumberOfLoadedTiles: 1000
        })
      )
      .readyPromise.then((tileset: any) => {
        this.drawPoints(viewer);
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

  drawPoints = (viewer: any) => {
    ajax({
      url: "http://47.95.1.229:9003/webapi/api/v1.1/basic/data",
      data: {
        key: "s_detecte_datas",
        begin_time: "2019-02-26 14:00:00",
        end_time: "2019-02-27 14:00:00"
      },
      success: ({ data }: { data: Array<any> }) => {
        for (let item of data) {
          const { lng, lat } = item;
          viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(
              parseFloat(lng),
              parseFloat(lat)
            ),
            name: "Red ellipse on surface",
            ellipse: {
              semiMinorAxis: 100,
              semiMajorAxis: 100,
              material: Cesium.Color.RED.withAlpha(0.5)
            }
          });
        }
      }
    });
  };
}
