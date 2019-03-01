import { Trunk } from '..';
import { ajax } from '../urlHelper';

ajax({
  url: '../mock/LatLon.json',
  success: ({ data }: { data: Array<any> }) => {
    new Trunk('root', {
      pointDatas: data,
      modelPaths: ['../mock/3dtileout/tileset.json'],
      onClick: (id: string) => {
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
            'closeButton'
          );
          if (closeButton) {
            closeButton.addEventListener('click', _ => {
              iframe.innerHTML = '';
            });
          }
        }
      }
    });
  }
});
