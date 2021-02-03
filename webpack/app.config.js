/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');

const currentDir = path.resolve(__dirname, '..');
const webapp = path.join(currentDir, 'public');
const appRoot = path.resolve(currentDir, 'src');

const package = require('../package.json');
const components = require('arachne-ui-components/package.json');

module.exports = function (env) {
  const APP_TYPE = {
    CENTRAL: 'central',
    NODE: 'node',
  };
  const ENV_TYPE = {
    DEV: 'development',
    TEST: 'test',
    QA: 'qa',
    PRODUCTION: 'production',
  };

  const appType = env.app || APP_TYPE.CENTRAL;
  const mode = env.mode || ENV_TYPE.PRODUCTION;
  const isSilent = env.silent || false;
  const isDevelopment = mode === ENV_TYPE.DEV;

  const preLoaders = [];
  if (!isSilent) {
    preLoaders.push({
      test: /\.js$/,
      exclude: /(node_modules|ArachneUIComponents)/,
      loader: 'eslint-loader',
    });
  }

  const plugins = [
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(currentDir, 'node_modules/arachne-ui-components/lib/resources/fonts'),
        to: path.join(webapp, 'fonts'),
      },
      {
        from: path.join(currentDir, 'node_modules/arachne-ui-components/lib/resources/material-design-icons/iconfont'),
        to: path.join(webapp, 'fonts'),
      },
      {
        from: path.join(currentDir, 'resources/icons'),
        to: path.join(webapp, 'img/icons'),
      },
    ]),
    new webpack.DefinePlugin({
      __APP_TYPE_CENTRAL__: appType === APP_TYPE.CENTRAL,
      __APP_TYPE_NODE__: appType === APP_TYPE.NODE,

      __DEV__: true,
      __VERSION__: JSON.stringify(package.version),
      __VERSION_COMPONENTS__: JSON.stringify(components.version),
      //
      'process.env': {
        NODE_ENV: mode === ENV_TYPE.PRODUCTION ? '"production"' : '"development"',
      },
    }),

    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|ru/),
  ];

  if(isDevelopment){
    plugins.push( new webpack.HotModuleReplacementPlugin())
  }

  if (mode === ENV_TYPE.PRODUCTION) {
  } else {
    if (mode === ENV_TYPE.QA) {
      plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
        })
      );
    }
  }

  const config = {
    context: appRoot,
    mode,
    entry: {
      main: ['regenerator-runtime/runtime', './index.js'],
    },
    output: {
      path: webapp,
      publicPath: '/',
      filename: 'js/[hash].js',
      chunkFilename: '[name]/[hash].js',
    },
    devtool: mode === ENV_TYPE.PRODUCTION ? false : 'source-map',
    resolve: {
      // root: appRoot,
      extensions: ['.js', '.jsx'],
      modules: [
        appRoot,
        path.join(currentDir, 'node_modules'),
      ],
      // fallback: path.join(currentDir, 'node_modules'),
      alias: {
        get: 'lodash/get'
      }
    },
    externals: [{
      xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}',
    }],
    module: {
      // preLoaders,
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|ArachneUIComponents)/i,
          loaders: 'babel-loader',
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: "style-loader"
            },
            {
              loader: "css-loader"
            },
            {
              loader: "sass-loader",
              options: {
                includePaths: [
                  appRoot,
                  path.join(currentDir, 'node_modules'),
                  currentDir,
                ],
                data: "$isAppNode: false;"
              },
            },
          ]
        },
        {
          test: /\.less$/,
          use: 'null-loader'
        }
      ],
    },
    plugins: plugins,
    devServer: {
      contentBase: webapp,
      historyApiFallback: true,
      port: appType === APP_TYPE.CENTRAL ? 8010 : 8020,
      hot: true,
      stats: {
        warnings: false
      },
      proxy: [
        {
          context: ['/api', '/arachne-websocket'],
          target: {
            "host": "localhost",
            "protocol": 'https:',
            "port": appType === APP_TYPE.CENTRAL ? 8080 : 8880,
          },
          secure: false,
        },
        {
          context: [
            'ws:**/arachne-websocket',
            'wss:**/arachne-websocket'
          ],
          target: {
            host: 'localhost',
            protocol: 'wss:',
            port: appType === APP_TYPE.CENTRAL ? 8080 : 8880,
          },
          secure: true,
        },
      ]
    },
  };

  return config;
};
