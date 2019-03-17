import Cesium from 'cesium';
import Model, { ModelProps } from '../tools/model';
import DevTool, { DevToolProps } from '../tools/dev';
import Point, { PointProps } from '../tools/point';
import Line, { LineProps } from '../tools/line';
import Polygon, { PolygonProps } from '../tools/polygon';
import { PointType, PointStyle } from '../tools/point';
import Base from './base';

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
  hoverColor?: string;
  type?: PointType;
  table?: TableItem;
  text?: string;
  width?: number | string;
  style?: PointStyle;
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

export default class Trunk extends Base {
  viewer: Cesium.Viewer;
  model: Model;
  devTool: DevTool;
  point: Point;
  line: Line;
  polygon: Polygon;

  constructor(root: string | HTMLElement, options?: TrunkProps) {
    super(root);
    if (!options) {
      options = {};
    }

    this.devTool = new DevTool(root, options.dev);
    this.model = new Model(root, options.model);
    this.point = new Point(root, options.point);
    this.polygon = new Polygon(root, options.polygon);
    this.line = new Line(root, options.line);
    this.bindClickEvent(options.onClick);
    this.bindHoverEvent(options.onHover);
    if (options.onMount) {
      options.onMount(this);
    }
    return this;
  }

  private bindClickEvent = (callback?: Function) => {
    const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene
      .canvas as any);
    handler.setInputAction(({ position }: any) => {
      const pick = this.viewer.scene.pick(position);
      if (pick && pick.id && callback) {
        callback(pick.id, position, pick);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  };

  private bindHoverEvent = (callback?: Function) => {
    const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene
      .canvas as any);

    const makeProperty = (entity: Cesium.Entity, color: Cesium.Color) => {
      const colorProperty: any = new Cesium.CallbackProperty((_, result) => {
        if (pickedEntities.contains(entity)) {
          const hoverColor =
            ((entity as any).customData &&
              (entity as any).customData.hoverColor) ||
            'red';
          return Cesium.Color.fromCssColorString(hoverColor).clone(result);
        }
        return color.clone(result);
      }, false);
      if (entity.polygon) {
        entity.polygon.material = new Cesium.ColorMaterialProperty(
          colorProperty,
        );
      }
    };
    const pickedEntities = new (Cesium as any).EntityCollection();
    handler.setInputAction(({ endPosition }: any) => {
      const drillPick = this.viewer.scene.drillPick(endPosition);
      if (Cesium.defined(drillPick)) {
        pickedEntities.removeAll();
        for (let i = 0; i < drillPick.length; i++) {
          const entity = drillPick[i].id;
          if (entity) {
            const color =
              (entity.customData && entity.customData.color) || '#ccc';
            makeProperty(entity, Cesium.Color.fromCssColorString(color));
            pickedEntities.add(entity);
          }
        }
      }

      if (callback) {
        const pick = this.viewer.scene.pick(endPosition);
        if (Cesium.defined(pick) && pick && pick.id) {
          callback(pick.id!._customData, endPosition, pick);
        } else {
          callback(null, endPosition, pick);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  };
}
