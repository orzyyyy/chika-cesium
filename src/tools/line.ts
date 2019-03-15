import Cesium from 'cesium';
import { CommonItem } from '../dispatcher';
import { formatColor } from '../utils';

export interface LineProps {
  dataSource: Array<CommonItem>;
}

export default class Line {
  constructor(viewer: Cesium.Viewer, options?: LineProps) {
    options = Object.assign({}, { dataSource: [] }, options);
    const { dataSource } = options;

    if (dataSource) {
      this.drawLine(viewer, dataSource);
    }
    return this;
  }

  public drawLine = (viewer: any, line: Array<CommonItem>) => {
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
      viewer.entities.add({
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
