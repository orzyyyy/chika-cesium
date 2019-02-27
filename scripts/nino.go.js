const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const webpack = require('webpack');

module.exports = {
  webpack: {
    externals: {
      cesium: 'Cesium'
    },
    plugins: [
      new CopyWebpackPlugin([
        {
          from: 'node_modules/cesium/Build/CesiumUnminified',
          to: 'cesium'
        }
      ]),
      new HtmlWebpackIncludeAssetsPlugin({
        append: false,
        assets: ['cesium/Widgets/widgets.css', 'cesium/Cesium.js']
      }),
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify('cesium')
      })
    ]
  }
};
