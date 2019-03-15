import Cesium from 'cesium';

export interface ModelProps {
  paths: Array<string>;
  onHover?: Function;
  onClick?: Function;
}

export default class Model {
  constructor(viewer: Cesium.Viewer, options: ModelProps) {
    const { paths, onHover, onClick } = options;
    if (paths) {
      this.loadModels(viewer, paths, () => {
        if (onHover) {
        }
        if (onClick) {
        }
      });
    }
    return this;
  }

  private loadModels = (
    viewer: any,
    paths: Array<string>,
    callback?: Function,
  ) => {
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
          callback && callback();
        })
        .otherwise((error: any) => {
          console.error(error);
        });
    }
  };
}
