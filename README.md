# chika-cesium

![CircleCI branch](https://img.shields.io/circleci/project/github/zy410419243/chika-cesium/master.svg) [![codecov](https://codecov.io/gh/zy410419243/chika-cesium/branch/master/graph/badge.svg)](https://codecov.io/gh/zy410419243/chika-cesium) [![Greenkeeper badge](https://badges.greenkeeper.io/zy410419243/chika-cesium.svg)](https://greenkeeper.io/)

A model loader using cesium, with some trick functions.

## Screenshots

<img src="./docs/screenshot.png" />

## Usage

```js
import { Trunk } from '..';

new Trunk('root', options);
```

For more detail, you can check [there](./src/demo/index.ts).

## API

### options

| name       | description                                                                                                                                                                               | type                                                                                      | default |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------- |
| dev        | notice your console when set to true, it will output coordinate infos                                                                                                                     | boolean                                                                                   | false   |
| pointDatas | draw pinners in the scene, notice that if data item contains prop `name`, it would draw a pinner with text of `name`, or it would draw using [icons](https://labs.mapbox.com/maki-icons/) | Array<{lng: number, lat: number, id: number, name?: string, color?: string}>              | []      |
| modelPaths | load models with paths, notice that this prop is null, it wouldn't show anything. Emmmm...maybe                                                                                           | Array<paths: string>                                                                      | []      |
| polygon    | draw polygons with coordinates                                                                                                                                                            | Array<{ dataSource: Array<{ lng: number; lat: number }>, name?: string, color?: string }> | []      |
| onClick    | when you click your entities, this function would be called                                                                                                                               | (pick.id, position, pick) => void                                                         | -       |
| onHover    | when you hover on your entities, this function would be called                                                                                                                            | (pick.id, position, pick) => void                                                         | -       |

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
