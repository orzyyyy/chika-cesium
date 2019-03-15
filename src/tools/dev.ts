import Cesium from 'cesium';

type CoordinateFunction = (
  latitude: string,
  longitude: string,
  altitude: string,
) => void;

export interface DevToolProps {
  coordinate?: CoordinateFunction;
}

export default class DevTool {
  constructor(viewer: Cesium.Viewer, options: DevToolProps) {
    const { coordinate } = options;

    if (coordinate) {
      this.consoleCoordinate(viewer, coordinate);
    }
    return this;
  }

  private consoleCoordinate = (viewer: any, callback: CoordinateFunction) => {
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
        callback(latitude, longitude, altitude);
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  };
}
