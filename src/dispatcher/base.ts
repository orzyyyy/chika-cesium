import Cesium from 'cesium';
import { DevToolProps } from '../tools/dev';

const defaultViewerOptions = {
  animation: false,
  vrButton: false,
  geocoder: false,
  infoBox: false,
  sceneModePicker: false,
  selectionIndicator: false,
  timeline: false,
  navigationHelpButton: false,
  scene3DOnly: false,
  homeButton: false,
  navigationInstructionsInitiallyVisible: false,
  fullscreenButton: false,
  baseLayerPicker: false,
  imageryProvider: new Cesium.UrlTemplateImageryProvider({
    url:
      'https://api.mapbox.com/styles/v1/gisjvm/cjrjkuagm1q422so0gfx2hxje/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2lzanZtIiwiYSI6ImNqcmpqdmthODBjOWM0NG8wdzBxZHR0eDcifQ.KU07Wizm4w9fH0mn0Hst8g',
  }),
};

export default class Base {
  static instance: Base;
  viewer: any;
  devOptions: DevToolProps;

  constructor(
    root: string | HTMLElement,
    options?: {
      devOptions?: {};
    },
  ) {
    if (Base.instance) {
      return Base.instance;
    }
    const viewer = new Cesium.Viewer(root, defaultViewerOptions);
    (viewer as any)._cesiumWidget._creditContainer.style.display = 'none';

    this.viewer = viewer;
    if (options) {
      this.devOptions = options.devOptions || {};
    }

    Base.instance = this;
    return this;
  }
}
