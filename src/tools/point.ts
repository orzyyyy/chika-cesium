import Cesium from 'cesium';
import html2canvas from 'html2canvas';
export type PointType = 'pin' | 'popup' | 'none' | undefined;
export interface PointProps {
  dataSource: Array<CommonItem>;
  type?: PointType;
}
import { CommonItem } from '../dispatcher';
import './assets/point.css';

export default class Point {
  constructor(viewer: Cesium.Viewer, options?: PointProps) {
    options = Object.assign({}, { dataSource: [] }, options);
    this.drawPoints(viewer, options);
    return this;
  }

  drawPoints = (viewer: any, options: PointProps) => {
    const { dataSource, type: parentType } = options;
    for (let item of dataSource) {
      const { type: childType } = item;
      const type = childType || parentType;
      switch (type) {
        case 'popup':
          this.drawPopup(viewer, item);
          break;

        case 'pin':
          this.drawText(viewer, item);
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

  private drawPopup = (
    viewer: any,
    { id, color = '#F96', lng, lat }: CommonItem,
  ) => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="point" style="background: ${color};">testtetettesttetettesttetet</div>
      <div class="point-after" style="background-color: ${color} transparent transparent transparent;"></div>
    `;
    wrapper.id = 'wrapper';
    wrapper.style.position = 'absolute';
    document.body.appendChild(wrapper);
    html2canvas(document.querySelector('#wrapper'), {
      logging: false,
      height: 70,
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
