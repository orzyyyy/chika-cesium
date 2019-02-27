import Cesium from 'cesium';
import Trunk from './core';

new Trunk('root', {
  animation: false,
  baseLayerPicker: true,
  selectedImageryProviderViewModel: undefined,
  vrButton: true,
  geocoder: false,
  homeButton: true,
  infoBox: true,
  sceneModePicker: true,
  selectionIndicator: true,
  timeline: false,
  navigationHelpButton: false,
  navigationInstructionsInitiallyVisible: false,
  scene3DOnly: false,
  useDefaultRenderLoop: true,
  targetFrameRate: 100,
  globe: new Cesium.Globe(new Cesium.WebMercatorProjection().ellipsoid),
});
