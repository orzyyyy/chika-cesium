import Cesium from 'cesium';
import { formatColor } from '../utils';
import { CommonItem } from '../dispatcher';

export interface PolygonProps {
  dataSource: Array<CommonItem>;
}

export default class Polygon {
  constructor(viewer: Cesium.Viewer, options?: PolygonProps) {
    options = Object.assign({}, { dataSource: [] }, options);
    const { dataSource } = options;

    this.drawPolygon(viewer, dataSource);
    return this;
  }

  public drawPolygon = (viewer: any, dataSource: Array<CommonItem>) => {
    for (let item of dataSource) {
      let result = [];
      const { dataSource, id, color } = item;
      // handle with coordinates
      // { lng, lat } => [lng, lat]
      for (let item of dataSource) {
        const { lng, lat } = item;
        result.push(lng);
        result.push(lat);
      }
      viewer.entities.add({
        customData: item,
        name: id || 'undefined polygon name',
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArray(result),
          material: formatColor(color),
        },
      });
    }
  };
}
