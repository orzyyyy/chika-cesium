import '@babel/polyfill';
import { ChikaToy } from 'chika-cesium';
import './assets/popup.css';
import { getCenterPointFromCoordinates } from 'chika-cesium/utils';
import Switch from 'weatherstar-switch';
import 'weatherstar-switch/dist/switch.css';

let switchStatus = 'hidden';

const dataSource = [
  {
    lng: 121.449,
    lat: 0.0382,
    height: 28,
  },
  {
    lng: 121.4485,
    lat: 0.0388,
    height: 40,
  },
  { lng: 121.4485, lat: 0.0406, height: 40 },
  { lng: 121.449, lat: 0.0392, height: 40 },
];
const lineProps = [
  {
    dataSource,
    color: 'red',
    id: 'testLine',
    width: 5,
  },
];
const polygonProps = [
  {
    dataSource,
    id: 'testId',
    name: 'testName',
    color: 'rgba(41, 103, 222, 0.5)',
    hoverColor: 'rgba(65, 125, 241, 0.5)',
    text: 'test',
    table: {
      dataSource: [
        { name: 'name: ', value: 'name' },
        { name: 'title: ', value: 'title' },
        { name: 'place: ', value: 'place' },
      ],
    },
  },
];
const pointDatas = {
  id: 'testId',
  text: 'testtest<br/>test',
  type: 'popup',
  style: {
    left: 110,
    top: 93,
    height: 60,
    width: 220,
    pinHeight: 100,
    background: 'rgba(0, 0, 0, 0.5)',
    color: '#fff',
    border: '2px solid rgba(115, 161, 255)',
  },
};

new ChikaToy('root', {
  // dev: { debugPopup: true },
  model: {
    paths: ['./assets/3dtileout/tileset.json'],
  },
  point: {
    dataSource: [
      { ...getCenterPointFromCoordinates(dataSource), ...pointDatas },
    ],
  },
  onMount: ({ viewer, line, polygon }: any) => {
    const switchWrapper = document.createElement('input');
    switchWrapper.className = 'switch-wrapper';
    switchWrapper.type = 'checkbox';
    document.body.appendChild(switchWrapper);
    const switchInstance = new Switch(
      document.querySelector('.switch-wrapper'),
      {
        onText: 'show',
        offText: 'hide',
        showText: true,
        checked: true,
        onInit: () => {
          const switchSpan: any = document.querySelector('.switch');
          switchSpan.style.position = 'absolute';
          switchSpan.style.right = '10px';
          switchSpan.style.top = '10px';
          switchSpan.style.width = '80px';
          setTimeout(() => {
            switchInstance.on();
          }, 0);
        },
        onChange: () => {
          viewer.entities.removeAll();
          let newPolygonProps = [];
          if (switchStatus === 'hidden') {
            newPolygonProps = polygonProps;
            switchStatus = 'show';
          } else {
            for (let item of polygonProps) {
              newPolygonProps.push({
                ...item,
                color: 'rgba(255,255,255,0)',
              });
            }
            switchStatus = 'hidden';
          }
          polygon.drawPolygon(newPolygonProps);
          line.drawLine(lineProps);
        },
      },
    );
  },
  onClick: ({ name: id }: any) => {
    const modal: HTMLElement | null = document.getElementById('modal');
    if (modal) {
      modal.innerHTML = `
      <div
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; background: #FFF;"
      >
        ${id}
      </div>
      <div
        style="position: absolute; top: 10px; right: 10px; z-index: 2; font-size: 22px; cursor: pointer;"
        id="closeButton"
      >
        X
      </div>
    `;
      const closeButton: HTMLElement | null = document.getElementById(
        'closeButton',
      );
      if (closeButton) {
        closeButton.addEventListener('click', _ => {
          modal.innerHTML = '';
        });
      }
      const tooltip: HTMLElement | null = document.getElementById('tooltip');
      if (tooltip) {
        tooltip.innerHTML = '';
      }
    }
  },
  onHover: (dataItem: any, { x, y }: { x: number; y: number }) => {
    const tooltip: HTMLElement | null = document.getElementById('tooltip');
    if (tooltip && dataItem) {
      const tableHeight = 105;
      const tableWidth = 250;
      let table = `<div style="text-align: center; width: 100%; height: ${tableHeight}px; z-index: 10; position: relative;" class="popup-content-wrapper">`;
      if (dataItem) {
        for (let item of dataItem.table.dataSource) {
          const height = item.value.length > 13 ? 45 : 35;
          table += `
              <div style="width: 30%; text-align: right; float: left; height: ${height}px;">${
            item.name
          }</div>
              <div style="width: 70%; text-align: center; float: left; height: ${height}px;">${
            item.value
          }</div>
            `;
        }
        table += '</div>';
      }
      tooltip.innerHTML = `
        <div style="position: absolute; top: ${y -
          tableHeight -
          30}px; left: ${x -
        tableWidth / 2}px; width: ${tableWidth}px; height: ${tableHeight}px;">
          ${table}
        </div>
      `;
    } else if (tooltip && !dataItem) {
      tooltip.innerHTML = '';
    }
  },
});
