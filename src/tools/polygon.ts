import Cesium from 'cesium';
import { formatColor } from '../utils';
import { CommonItem } from '../dispatcher';
import Base from '../dispatcher/base';

export interface PolygonProps {
  dataSource: Array<CommonItem>;
}

export default class Polygon extends Base {
  constructor(root: string | HTMLElement, options?: PolygonProps) {
    super(root);
    options = Object.assign({}, { dataSource: [] }, options);
    const { dataSource } = options;

    this.drawPolygon(dataSource);
    return this;
  }

  public drawPolygon = (dataSource: Array<CommonItem>) => {
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
      this.viewer.entities.add({
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
