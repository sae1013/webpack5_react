const path = require('path');
const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode:'development',
  entry: {
    index: './src/index.tsx'
  },
  devtool:'eval-source-map',
  // devtool:'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean:true
  },
  devServer: {
    static: {
      directory:path.join(__dirname,'dist'),
    },
    compress: true,
    port: 3000
  },
  module: {
    rules:[
      {
        test:/\.(js|jsx)$/,
        exclude: "/node_modules",
        use:['babel-loader']
      },
      {
        test:/\.tsx?$/,
        use:'ts-loader',
        exclude:"/node_modules"
      },
      {
        test: /\.html$/,
        use:[
          {
            loader:"html-loader",
            options:{minimize:true}
          }
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader,'css-loader']
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      }
    ]
  },
  resolve: {
    extensions:['.tsx', '.ts','.js']
  },
  plugins:[
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    }),
    new webpack.ProgressPlugin(),
    new MiniCssExtractPlugin({
      filename:'style.css'
    })
  ],

};
