import Cesium from 'cesium';

export type PointType = 'pin' | 'text' | 'none' | undefined;
export interface PointProps {
  dataSource: Array<any>;
}

export default class Point {
  constructor(viewer: Cesium.Viewer, options: PointProps) {
    const { dataSource } = options;

    if (dataSource) {
      this.drawPoints(viewer, dataSource);
    }
  }

  drawPoints = (viewer: any, dataSource: Array<any>) => {
    const pinBuilder = new Cesium.PinBuilder();
    for (let item of dataSource) {
      const { lng, lat, id, name, color, type } = item;
      if (type === 'text') {
        viewer.entities.add({
          name,
          position: Cesium.Cartesian3.fromDegrees(
            parseFloat(lng),
            parseFloat(lat),
            30,
          ),
          billboard: {
            image: pinBuilder
              .fromText(name, Cesium.Color.ORANGE, 100)
              .toDataURL(),
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            width: name.length * 40,
            height: name.length * 30,
          },
        });
      } else if (type === 'pin') {
        (Cesium as any).when(
          pinBuilder.fromMakiIconId(
            'building',
            Cesium.Color.fromCssColorString(color),
            60,
          ),
          (canvas: any) => {
            return viewer.entities.add({
              name: id,
              position: Cesium.Cartesian3.fromDegrees(
                parseFloat(lng),
                parseFloat(lat),
                30,
              ),
              billboard: {
                image: canvas.toDataURL(),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              },
            });
          },
        );
      } else if (type === 'none' || !type) {
      }
    }
  };
}
