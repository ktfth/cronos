const pkg = require('./package.json');
const path = require('path');
const webpack = require('webpack');
const ClosurePlugin = require('closure-webpack-plugin');

const production = process.env.NODE_ENV === 'production';

const banner = `cronos v${pkg.version}
https://ktfth.github.io/cronos

Licensed ISC`;

module.exports = {
  entry: './index.js',
  mode: 'production',
  output: {
    filename: production ? 'cronos.min.js' : 'cronos.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'cronos',
    globalObject: 'this',
    libraryExport: 'default',
    libraryTarget: 'window',
  },
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }],
  },
  optimization: {
    minimizer: [new ClosurePlugin({ mode: 'STANDARD' }, {})],
  },
  plugins: [new webpack.BannerPlugin({ banner })],
};
