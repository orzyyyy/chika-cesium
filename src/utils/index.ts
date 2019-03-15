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
