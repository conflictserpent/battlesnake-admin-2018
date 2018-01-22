const nodeExternals = require('webpack-node-externals')
const path = require('path')
const slsw = require('serverless-webpack')

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  externals: [nodeExternals()],
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
}
