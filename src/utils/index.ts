import Cesium from 'cesium';
import { CommonItem } from '../dispatcher';

export const getCenterPointFromCoordinates = ({
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

export const formatColor = (color: string | undefined) => {
  let material: Cesium.Color | string | undefined = color;
  if (!color) {
    material = Cesium.Color.TRANSPARENT;
  } else if (color) {
    material = Cesium.Color.fromCssColorString(color);
  }
  return material;
};

export function noop() {}
