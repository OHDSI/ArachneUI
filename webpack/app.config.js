/*
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
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const argv = require('yargs').argv;
const keyMirror = require('keymirror');
const WebpackDevServer = require('webpack-dev-server');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


const currentDir = path.resolve(__dirname, '..');
const webapp = path.join(currentDir, 'public');
const appRoot = path.resolve(currentDir, 'src');

const entryPoint = path.resolve(appRoot, 'index.js');


const APP_TYPE = {
  CENTRAL: 'central',
  NODE: 'node',
};
const ENV_TYPE = {
  DEV: 'dev',
  TEST: 'test',
  QA: 'qa',
  PRODUCTION: 'production',
};

const appType = argv.app || APP_TYPE.CENTRAL;
const env = argv.env || ENV_TYPE.PRODUCTION;
const isSilent = argv.silent || false;

const preLoaders = [];
if (!isSilent) {
  preLoaders.push({
      test: /\.js$/,
      exclude: /(node_modules|ArachneUIComponents)/,
      loader: 'eslint-loader',
    });
}

const config = {
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8001', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    entryPoint, // Appʼs entry point
  ],
  resolve: {
    root: appRoot,
    extensions: ['', '.js', '.jsx'],
    fallback: path.join(currentDir, 'node_modules'),
    alias: {
      get: 'lodash/get'
    }
  },
  sassLoader: {
    includePaths: [appRoot, path.resolve(currentDir, 'node_modules')],
    data: `$isAppCentral: ${appType === APP_TYPE.CENTRAL}; $isAppNode: ${appType === APP_TYPE.NODE};`,
  },
  eslint: {
    configFile: './.eslintrc',
    // fix: true,
  },
  externals: [{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}',
  }],
  module: {
    // preLoaders,
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|ArachneUIComponents)/,
        loader: 'babel',
      },
      {
        test: /atlascharts\.js$/,
        loader: 'babel',
      },
      {
        test: /\.json?$/,
        loader: 'json',
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!postcss!sass'), // 'style!css!postcss!sass',
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000',
      },
    ],
  },
  postcss: () => [
    require('precss'),
    require('autoprefixer'),
  ],
  output: {
    path: webapp,
    publicPath: '/',
    filename: 'js/app.js',
  },
  devtool: env === ENV_TYPE.PRODUCTION ? null : 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      __APP_TYPE_CENTRAL__: appType === APP_TYPE.CENTRAL,
      __APP_TYPE_NODE__: appType === APP_TYPE.NODE,

      __DEV__: true,
      //
      'process.env': {
        NODE_ENV: env === ENV_TYPE.PRODUCTION ? '"production"' : '"development"',
      },
    }),
    new ExtractTextPlugin('css/app.css'),
    new webpack.HotModuleReplacementPlugin(),
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

    // https://medium.com/@adamrackis/vendor-and-code-splitting-in-webpack-2-6376358f1923
    new webpack.optimize.CommonsChunkPlugin({
      async: 'used-twice',
      minChunks(module, count) {
          return count >= 2;
      },
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|ru/),
  ],
};

if (env === ENV_TYPE.PRODUCTION) {
  config.entry = [entryPoint];
  // minification
  config.output.publicPath = '/';
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    comments: false,
  }));
  config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin());
  config.plugins.push(new webpack.optimize.DedupePlugin());
}

if (env === ENV_TYPE.DEV) {
  // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  // Webpack hot reload server
  const server = new WebpackDevServer(
    webpack(config),
    {
      contentBase: webapp,
      hot: true,
      historyApiFallback: true,
      stats: {
        colors: true,
      },
      proxy: {
        // json-server db.json --routes routes.json --port 9999
        '/api-dev/**': {
          target: 'http://localhost:9999/',
          changeOrigin: true,
        },
        '/arachne-websocket/**': {
          target: appType === APP_TYPE.NODE
            ? 'ws://localhost:8090/'
            : 'ws://localhost:8080/',
          changeOrigin: true,
          ws: true,
        },
        '/api/**': {
          target: appType === APP_TYPE.NODE
            ? 'https://localhost:8880/'
            : 'https://localhost:8080/',
          changeOrigin: true,
          secure: false,
        },
      },
    }
  );

  server.listen(
    appType === APP_TYPE.NODE ? 8020 : 8010,
    'localhost'
  );
}

if (env === ENV_TYPE.QA) {
  config.plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
    })
  );
}

module.exports = config;
