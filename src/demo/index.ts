import { Trunk } from '..';

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
      // name: 'test',
      color: '#F96',
      id: 'test1',
    },
  ],
  onClick: ({ name: id }: any) => {
    const iframe: HTMLElement | null = document.getElementById('modal');
    if (iframe) {
      iframe.innerHTML = `
        <iframe
          src="http://www.google.com?stcd=${id}"
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;"
        >
        </iframe>
        <div
          style="position: absolute; top: 10px; right: 10px; z-index: 2;"
          id="closeButton"
        >
          close
        </div>
      `;
      const closeButton: HTMLElement | null = document.getElementById(
        'closeButton',
      );
      if (closeButton) {
        closeButton.addEventListener('click', _ => {
          iframe.innerHTML = '';
        });
      }
    }
  },
  onHover: (_: any, { x, y }: any) => {
    const tooltip: HTMLElement | null = document.getElementById('tooltip');
    if (tooltip) {
      tooltip.innerHTML = `
        <div style="position: absolute; top: ${y}px; left: ${x}px; z-index: 2; background: #fff; width: 10px; height: 10px;">
        </div>
      `;
    }
  },
});
