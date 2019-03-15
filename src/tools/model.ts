import Cesium from 'cesium';

export interface ModelOptions {
  paths: Array<string>;
  onHover?: Function;
  onClick?: Function;
}

export default class Model {
  constructor(viewer: any, options: ModelOptions) {
    if (options.paths) {
      this.loadModels(viewer, options.paths);
    }
  }

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
}
