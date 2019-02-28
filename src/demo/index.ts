import Trunk from "..";
import Cesium from "cesium";
import { ajax } from "../urlHelper";

new Trunk("root", {
  drawPoints: (viewer: any) => {
    ajax({
      url: "../mock/LatLon.json",
      success: ({ data }: { data: Array<any> }) => {
        for (let item of data) {
          const { lng, lat, name } = item;
          viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(
              parseFloat(lng),
              parseFloat(lat)
            ),
            name,
            ellipse: {
              semiMinorAxis: 100,
              semiMajorAxis: 100,
              material: Cesium.Color.RED.withAlpha(0.5)
            }
          });
        }
      }
    });
  }
});
