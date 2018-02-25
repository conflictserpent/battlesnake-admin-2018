const nodeExternals = require('webpack-node-externals')
const path = require('path')
const slsw = require('serverless-webpack')
const webpack = require('webpack')

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  externals: [nodeExternals()],
  devtool: 'inline-source-map',
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '.webpack'),
    filename: 'entry.js'
  },
  module: {
    loaders: [
      {
        test: /\.ts(x?)$/,
        exclude: [/node_modules/, './.webpack', './.serverless'],
        loaders: ['ts-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
  },
  plugins: [
    // This doesn't work on lambda for some reason:
    // new webpack.BannerPlugin({ banner: 'require("source-map-support").install();', raw: true, entryOnly: false })
  ]
}
