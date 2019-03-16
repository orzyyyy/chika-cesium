import Cesium from 'cesium';
import Model, { ModelProps } from '../tools/model';
import DevTool, { DevToolProps } from '../tools/dev';
import Point, { PointProps } from '../tools/point';
import Line, { LineProps } from '../tools/line';
import Polygon, { PolygonProps } from '../tools/polygon';
import { PointType } from '../tools/point';

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

type TableItem = {
  columns: Array<{ key: string; name: string }>;
  dataSource: Array<any>;
};
export type CoordinateItem = {
  lng: number;
  lat: number;
  height?: number;
};
export type CommonItem = {
  dataSource: Array<CoordinateItem>;
  name?: string;
  id?: string;
  color?: string;
  type?: PointType;
  table?: TableItem;
  text?: string;
  width?: number | string;
} & CoordinateItem;
type TrunkProps = {
  dev?: DevToolProps;
  model?: ModelProps;
  point?: PointProps;
  onClick?: (name: string, position: any, pick: any) => void;
  onHover?: (name: string, position: any, pick: any) => void;
  polygon?: PolygonProps;
  line?: LineProps;
  onMount?: (instance: Trunk) => void;
};

export default class Trunk {
  viewer: Cesium.Viewer;
  model: Model;
  devTool: DevTool;
  point: Point;
  line: Line;
  polygon: Polygon;

  constructor(root: string | HTMLElement, options?: TrunkProps) {
    const viewer = new Cesium.Viewer(root, defaultViewerOptions);
    (viewer as any)._cesiumWidget._creditContainer.style.display = 'none';
    this.viewer = viewer;
    if (!options) {
      options = {};
    }

    this.devTool = new DevTool(viewer, options.dev);
    this.model = new Model(viewer, options.model);
    this.point = new Point(viewer, options.point);
    this.polygon = new Polygon(viewer, options.polygon);
    this.line = new Line(viewer, options.line);
    this.bindClickEvent(viewer, options.onClick);
    this.bindHoverEvent(viewer, options.onHover);
    if (options.onMount) {
      options.onMount(this);
    }
    return this;
  }

  private bindClickEvent = (viewer: any, callback?: Function) => {
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(({ position }: any) => {
      const pick = viewer.scene.pick(position);
      if (pick && pick.id && callback) {
        callback(pick.id, position, pick);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  };

  private bindHoverEvent = (viewer: any, callback?: Function) => {
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    const makeProperty = (entity: Cesium.Entity, color: Cesium.Color) => {
      const colorProperty: any = new Cesium.CallbackProperty((_, result) => {
        if (pickedEntities.contains(entity)) {
          return Cesium.Color.YELLOW.withAlpha(0.5).clone(result);
        }
        return color.clone(result);
      }, false);
      entity.polygon.material = new Cesium.ColorMaterialProperty(colorProperty);
    };
    const pickedEntities = new (Cesium as any).EntityCollection();
    handler.setInputAction(({ endPosition }: any) => {
      const drillPick = viewer.scene.drillPick(endPosition);
      if (Cesium.defined(drillPick)) {
        pickedEntities.removeAll();
        for (let i = 0; i < drillPick.length; i++) {
          const entity = drillPick[i].id;
          if (entity) {
            makeProperty(entity, Cesium.Color.RED.withAlpha(0.5));
            pickedEntities.add(entity);
          }
        }
      }

      if (callback) {
        const pick = viewer.scene.pick(endPosition);
        if (Cesium.defined(pick) && pick && pick.id) {
          callback(pick.id!._customData, endPosition, pick);
        } else {
          callback(null, endPosition, pick);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  };
}
