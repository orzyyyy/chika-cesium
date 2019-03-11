import { Trunk } from '..';
import './assets/popup.css';

new Trunk('root', {
  modelPaths: ['../mock/3dtileout/tileset.json'],
  polygon: [
    {
      dataSource: [
        {
          lng: 121.449,
          lat: 0.0382,
        },
        {
          lng: 121.4485,
          lat: 0.0388,
        },
        { lng: 121.4485, lat: 0.0406 },
        { lng: 121.449, lat: 0.0392 },
      ],
      id: 'testId',
      name: 'testName',
      color: '#F96',
      type: 'pin',
      table: {
        columns: [
          { key: 'name', name: '名称' },
          { key: 'title', name: '标题' },
          { key: 'place', name: '地点' },
        ],
        dataSource: [
          { name: '名称1', title: '标题1', place: '地点1' },
          { name: '名称2', title: '标题2', place: '地点2' },
          { name: '名称3', title: '标题3', place: '地点3' },
        ],
      },
    },
  ],
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
      const tableHeight = 150;
      const tableWidth = 200;
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
