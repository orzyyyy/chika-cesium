import Cesium from 'cesium';
import html2canvas from 'html2canvas';
export type PointType = 'pin' | 'popup' | 'none' | undefined;
export interface PointProps {
  dataSource: Array<CommonItem>;
  type?: PointType;
}
import { CommonItem } from '../dispatcher';

export default class Point {
  constructor(viewer: Cesium.Viewer, options?: PointProps) {
    options = Object.assign({}, { dataSource: [] }, options);
    const { dataSource } = options;

    if (dataSource) {
      this.drawPoints(viewer, dataSource);
    }
    return this;
  }

  drawPoints = (viewer: any, dataSource: Array<CommonItem>) => {
    for (let item of dataSource) {
      const { type } = item;

      switch (type) {
        case 'popup':
          this.drawText(viewer, item);
          break;

        case 'pin':
          this.drawPin(viewer, item);
          break;

        default:
          break;
      }
    }
  };

  private drawText = (viewer: any, { lng, lat, text = '' }: CommonItem) => {
    const pinBuilder = new Cesium.PinBuilder();
    viewer.entities.add({
      name: text,
      position: Cesium.Cartesian3.fromDegrees(lng, lat, 30),
      billboard: {
        image: pinBuilder
          .fromText(name || '', Cesium.Color.ORANGE, 100)
          .toDataURL(),
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        width: text.length * 40,
        height: text.length * 30,
      },
    });
  };

  private drawPin = (
    viewer: any,
    { id, color = '#F96', lng, lat }: CommonItem,
  ) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div style="background: ${color};">testtetettesttetettesttetet</div>
      <div class="popup-tip-container popup-tip" style="top: 0px; background: blue; z-index: -1;"></div>
    `;
    wrapper.id = 'wrapper';
    wrapper.style.position = 'absolute';
    document.body.appendChild(wrapper);
    html2canvas(document.querySelector('#wrapper'), {
      logging: false,
      height: 40,
      backgroundColor: null,
    }).then((canvas: HTMLCanvasElement) => {
      viewer.entities.add({
        name: id,
        position: Cesium.Cartesian3.fromDegrees(lng, lat, 30),
        billboard: {
          image: canvas.toDataURL(),
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        },
      });
      document.body.removeChild(wrapper);
    });
  };
}
