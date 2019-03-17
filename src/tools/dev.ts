import Cesium from 'cesium';
import { noop } from '../utils';
import Base from '../dispatcher/base';

type CoordinateFunction = (
  latitude: string,
  longitude: string,
  altitude: string,
) => void;

export interface DevToolProps {
  coordinate?: CoordinateFunction;
}

export default class DevTool extends Base {
  constructor(root: string | HTMLElement, options?: DevToolProps) {
    super(root);
    options = Object.assign({}, { coordinate: noop }, options);
    const { coordinate } = options;
    if (coordinate) {
      this.consoleCoordinate(coordinate);
    }
    return this;
  }

  private consoleCoordinate = (callback: CoordinateFunction) => {
    const viewer = this.viewer;
    const canvas: any = viewer.scene.canvas;
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
