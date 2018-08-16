const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const helpers = require("./helpers");

const dotenv = require("dotenv");
const envFile = dotenv.config().parsed;

const NODE_ENV = process.env.NODE_ENV;
const isProd = NODE_ENV === "production";
// console.log(cunt)
module.exports = {
  entry: {
    app: [helpers.root("client/app/index.js")]
  },

  output: {
    path: helpers.root("dist"),
    publicPath: "/"
  },

  resolve: {
    extensions: [".js", ".json", ".css", ".scss", ".html"],
    alias: {
      app: "client/app"
    }
  },

  module: {
    rules: [
      // JS files
      {
        test: /\.(js|jsx)$/,
        include: helpers.root("client"),
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader", "eslint-loader"]
      },
      // SCSS files
      {
        test: /\.scss|css$/,
        loader: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                sourceMap: true,
                importLoaders: 1
              }
            },
            {
              loader: "postcss-loader",
              options: {
                plugins: () => [autoprefixer]
              }
            },
            "sass-loader"
          ]
        })
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: "file-loader"
          }
        ]
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),

    new webpack.DefinePlugin({
      "process.env": {
        IP_ENV: isProd
          ? JSON.stringify(envFile.PROD_IP_ENV)
          : JSON.stringify(envFile.DEV_IP_ENV),
        PORT_ENV: isProd
          ? JSON.stringify(envFile.PROD_P_ENV)
          : JSON.stringify(envFile.DEV_P_ENV),
        NODE_ENV: JSON.stringify(NODE_ENV)
      }
    }),

    new HtmlWebpackPlugin({
      template: helpers.root("client/public/index.html"),
      inject: "body"
    }),

    new ExtractTextPlugin({
      filename: "css/[name].[hash].css",
      disable: !isProd
    }),

    new CopyWebpackPlugin([
      {
        from: helpers.root("client/public")
      }
    ])
  ]
};
