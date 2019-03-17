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
    color: '#F96',
    hoverColor: 'yellow',
    text: 'test',
    table: {
      columns: [
        { key: 'name', name: 'name' },
        { key: 'title', name: 'title' },
        { key: 'place', name: 'place' },
      ],
      dataSource: [
        { name: 'name1', title: 'title1', place: 'place1' },
        { name: 'name2', title: 'title2', place: 'place2' },
        { name: 'name3', title: 'title3', place: 'place3' },
      ],
    },
  },
];
const pointDatas = {
  id: 'testId',
  color: '#F96',
  text: 'testtest<br/>test',
  type: 'popup',
  style: {
    left: 110,
    top: 93,
    height: 60,
    width: 220,
    pinHeight: 100,
  },
};

new ChikaToy('root', {
  // dev: { debugPopup: true },
  model: {
    paths: ['../mock/3dtileout/tileset.json'],
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
    }
  },
  onHover: (dataItem: any, { x, y }: any) => {
    const tooltip: HTMLElement | null = document.getElementById('tooltip');
    if (tooltip && dataItem) {
      const tableHeight = 200;
      const tableWidth = 400;
      let table = `<table style="text-align: center; width: 100%; height: ${tableHeight}px;" class="popup-content-wrapper"><tr>`;
      if (dataItem) {
        for (let column of dataItem.table.columns) {
          table += `<th>${column.name}</th>`;
        }
        table += '</tr>';
        for (let item of dataItem.table.dataSource) {
          table += '<tr>';
          for (let column of dataItem.table.columns) {
            table += `<td>${item[column.key]}</td>`;
          }
          table += '</tr>';
        }
        table += '</table>';
      }
      table += '<div class="popup-tip-container popup-tip"></div>';
      tooltip.innerHTML = `
      <div style="position: absolute; top: ${y -
        tableHeight -
        15}px; left: ${x -
        tableWidth / 2}px; width: ${tableWidth}px; height: ${tableHeight}px;">
        ${table}
      </div>
    `;
    } else if (tooltip && !dataItem) {
      tooltip.innerHTML = '';
    }
  },
});
