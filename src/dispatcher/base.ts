import Cesium from 'cesium';

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
};

export default class Base {
  static instance: Base;
  viewer: any;

  constructor(root: string | HTMLElement) {
    if (Base.instance) {
      return Base.instance;
    }
    const viewer = new Cesium.Viewer(root, defaultViewerOptions);
    (viewer as any)._cesiumWidget._creditContainer.style.display = 'none';
    this.viewer = viewer;
    Base.instance = this;
    return this;
  }
}
