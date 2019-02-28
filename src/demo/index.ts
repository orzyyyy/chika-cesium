import Trunk from "..";
import { ajax } from "../urlHelper";

ajax({
  url: "../mock/LatLon.json",
  success: ({ data }: { data: Array<any> }) => {
    new Trunk("root", {
      pointDatas: data,
      modalPaths: ["../mock/3dtileout/tileset.json"],
      onClick: (id: string) => console.log(id)
    });
  }
});
