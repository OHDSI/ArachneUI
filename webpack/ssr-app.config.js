/**
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: July 17, 2017
 *
 */

const webpack = require('webpack');
const path = require('path');
const argv = require('yargs').argv;

const currentDir = path.resolve(__dirname, '..');
const webapp = path.join(currentDir, 'public');
const appRoot = path.resolve(currentDir, 'src');

const APP_TYPE = {
  CENTRAL: 'central',
  NODE: 'node',
};
const ENV_TYPE = {
  DEV: 'dev',
  TEST: 'test',
  QA: 'qa',
  PRODUCTION: 'production',
}

const appType = argv.app || APP_TYPE.CENTRAL;
const env = argv.env || ENV_TYPE.PRODUCTION;

const config = {
  entry: [
    './src/server.js' // Appʼs entry point
  ],
  resolve: {
    root: appRoot,
    extensions: ['', '.js', '.jsx'],
    fallback: path.join(currentDir, 'node_modules')
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|ArachneFrontComponents)/,
        loader: 'babel'
      },
      {
        test: /\.json?$/,
        loader: 'json'
      },
      {
        test: /\.scss$/,
        loader: 'ignore-loader',
      }
    ]
  },
  target: 'node',
  devtool: 'source-map',
  output: {
    path: webapp,
    filename: 'js/server.js',
    libraryTarget: 'umd',
  },
  plugins: [
    new webpack.DefinePlugin({
      __APP_TYPE_CENTRAL__: appType === APP_TYPE.CENTRAL,
      __APP_TYPE_NODE__: appType === APP_TYPE.NODE,

      __DEV__: true,
      //
      'process.env': {
        'NODE_ENV': env === ENV_TYPE.PRODUCTION ? '"production"' : '"development"',
      }
    })
  ]
};

module.exports = config;