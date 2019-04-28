# chika-cesium

![CircleCI branch](https://img.shields.io/circleci/project/github/zy410419243/chika-cesium/master.svg)
[![codecov](https://codecov.io/gh/zy410419243/chika-cesium/branch/master/graph/badge.svg)](https://codecov.io/gh/zy410419243/chika-cesium)

[English](./README.md) | 简体中文

基于 cesium 的模型加载器

在线示例: https://zy410419243.github.io/chika-cesium

## 截屏

<img src="./docs/screenshot.png" />

## 用法

```js
import { ChikaToy } from 'chika-cesium';

type PointType = 'pin' | 'text' | 'none' | undefined;

type CoordinateItem = {
  lng: number,
  lat: number,
  height?: number,
};

type CommonItem = {
  dataSource: Array<CoordinateItem>,
  name?: string,
  id?: string,
  color?: string,
  type?: PointType,
  table?: TableItem,
  text?: string,
  width?: number | string,
} & CoordinateItem;

const trunk = new ChikaToy('root', {
  // 传入方法时可以观察控制台
  // 该方法将会在回调中传出坐标信息
  dev?: {
    coordinate?: ({
      latitude: string,
      longitude: string,
      altitude: string,
    }) => void,
  },
  // 模型文件地址，不传则不显示
  model?: {
    paths?: Array<string>,
  },
  // 画点
  // 如果传了属性 name，那会画一个包含 name 的 pinner
  // 不传则会画一个 [icon](https://labs.mapbox.com/maki-icons/)
  point?: {
    dataSource?: Array<CommonItem>,
  },
  // 根据坐标画线
  line?: {
    dataSource?: Array<CommonItem>,
  },
  // 根据坐标画面
  // draw polygons with coordinates
  polygon?: {
    dataSource?: Array<CommonItem>,
  },
  // 画布渲染完成时的勾子
  // 回调将会返回 ChikaToy 实例
  onMount?: () => void,
  // 点击实体时的回调
  onClick?: (pick.id, position, pick) => void,
  // 移入实体时的回调
  onHover?: (pick.id, position, pick) => void,
});
```

[这里](./src/demo/index.ts)查看 demo

## 安装

```
npm install

npm start
```

## 示例

http://localhost:9099/

## Test Case

```
npm test
```

## Coverage

```
npm run coverage
```
