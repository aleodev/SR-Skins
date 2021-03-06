// const webpack = require("webpack");
const merge = require("webpack-merge");
const commonConfig = require("./webpack.common");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = merge(commonConfig, {
  mode: "production",
  output: {
    filename: "js/[name].[hash].js",
    chunkFilename: "[id].[hash].chunk.js"
  },

  optimization: {
    minimizer: [
      // we specify a custom UglifyJsPlugin here to get source maps in production
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: true,
          ecma: 6,
          mangle: true
        },
        sourceMap: true
      })
    ]
  },
  plugins: [
    // new webpack.DefinePlugin({
    //   __REACT_DEVTOOLS_GLOBAL_HOOK__: "({ isDisabled: true })"
    // })
  ]
});
