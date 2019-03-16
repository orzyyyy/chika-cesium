import Cesium from 'cesium';
import html2canvas from 'html2canvas';
export type PointType = 'pin' | 'popup' | 'none' | undefined;
export interface PointProps {
  dataSource: Array<CommonItem>;
  type?: PointType;
}
export type PointStyle = {
  background: string;
  width: string;
  height: string;
  left: string;
  top: string;
};
import { CommonItem } from '../dispatcher';
import './assets/point.css';

const defaultPointStyle = {
  background: '#f3961c transparent transparent transparent',
  width: '220px',
  height: '30px',
  left: '110px',
  top: '63px',
};

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
      const type = childType || parentType || 'popup';
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
    { id, lng, lat, text, style }: CommonItem,
  ) => {
    style = Object.assign({}, defaultPointStyle, style);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="point" style="background: ${style.background}; width: ${
      style.width
    }; height: ${style.height}; line-height: ${style.height};">${text}</div>
      <div class="point-after" style="background-color: ${
        style.background
      } transparent transparent transparent; left: ${style.left}; top: ${
      style.top
    };"></div>
    `;
    wrapper.id = 'wrapper';
    wrapper.style.position = 'absolute';
    // wrapper.style.top = '0px';
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
