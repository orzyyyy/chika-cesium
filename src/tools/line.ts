import Cesium from 'cesium';
import { CommonItem } from '../dispatcher';
import { formatColor } from '../utils';
import Base from '../dispatcher/base';

export interface LineProps {
  dataSource: Array<CommonItem>;
}

export default class Line extends Base {
  constructor(root: string | HTMLElement, options?: LineProps) {
    super(root);
    options = Object.assign({}, { dataSource: [] }, options);
    const { dataSource } = options;

    if (dataSource) {
      this.drawLine(dataSource);
    }
    return this;
  }

  public drawLine = (line: Array<CommonItem>) => {
    for (let lineItem of line) {
      let result = [];
      const { dataSource, id, color, width } = lineItem;
      // handle with coordinates
      // { lng, lat } => [lng, lat]
      for (let item of dataSource) {
        const { lng, lat, height } = item;
        result.push(lng);
        result.push(lat);
        if (height) {
          result.push(height);
        }
      }
      this.viewer.entities.add({
        name: id || 'undefined line name',
        polyline: {
          customData: lineItem,
          positions: Cesium.Cartesian3.fromDegreesArrayHeights(result),
          width,
          arcType: (Cesium as any).ArcType.RHUMB,
          material: formatColor(color),
        },
      });
    }
  };
}
