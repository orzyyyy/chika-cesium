# chika-cesium

![CircleCI branch](https://img.shields.io/circleci/project/github/zy410419243/chika-cesium/master.svg)
[![codecov](https://codecov.io/gh/zy410419243/chika-cesium/branch/master/graph/badge.svg)](https://codecov.io/gh/zy410419243/chika-cesium)

English | [简体中文](./README-zh_CN.md)

A model loader using cesium, with some trick functions.

Online demo: https://zy410419243.github.io/chika-cesium

## Screenshots

<img src="./docs/screenshot.png" />

## Usage

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
  // notice your console when passing a function,
  // it will output coordinate infos with its callback
  dev?: {
    coordinate?: ({
      latitude: string,
      longitude: string,
      altitude: string,
    }) => void,
  },
  // load models with paths,
  // notice that when this prop is null, it wouldn't show anything
  // Emmmm...maybe
  model?: {
    paths?: Array<string>,
  },
  // draw pinners in the scene, notice that if data item contains prop `name`,
  // it would draw a pinner with text of `name`,
  // or it would draw using [icons](https://labs.mapbox.com/maki-icons/)
  point?: {
    dataSource?: Array<CommonItem>,
  },
  // draw lines with coordinates
  line?: {
    dataSource?: Array<CommonItem>,
  },
  // draw polygons with coordinates
  polygon?: {
    dataSource?: Array<CommonItem>,
  },
  // when initial completed,
  // this would be called with current instance of ChikaToy
  onMount?: () => void,
  // when you click your entities,
  // this function would be called
  //
  // @pick the entity you click on
  onClick?: (pick.id, position, pick) => void,
  // when you hover on your entities,
  // this function would be called
  //
  // @pick the entity you click on
  onHover?: (pick.id, position, pick) => void,
});
```

Check [here](./src/demo/index.ts) for more details.

## Development

```
npm install

npm start
```

## Example

http://localhost:9099/

## Test Case

```
npm test
```

## Coverage

```
npm run coverage
```
