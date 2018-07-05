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
 * Created: July 13, 2017
 *
 */

const Express = require('express');
const httpProxy = require('http-proxy');
const path = require('path');
const http = require('http');
const cookieParser = require('cookie-parser');

const config = require('./config');

const setup = function () {
  const targetUrl = `http://${config.apiHost}:${config.apiPort}`;
  const app = new Express();
  const server = new http.Server(app);
  const proxy = httpProxy.createProxyServer({
    target: targetUrl,
    ws: true,
  });

  app.use(Express.static(path.join(__dirname, '..', 'public')));

  app.use(cookieParser());

// Proxy to API server
  app.use('/api/v1', (req, res) => {
    proxy.web(req, res, {target: targetUrl + '/api/v1'});
  });

  app.use('/arachne-websocket', (req, res) => {
    proxy.web(req, res, {target: `${targetUrl}/arachne-websocket`});
  });

  server.on('upgrade', (req, socket, head) => {
    proxy.ws(req, socket, head);
  });

// added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
  proxy.on('error', (error, req, res) => {
    let json;
    if (error.code !== 'ECONNRESET') {
      console.error('proxy error', error);
    }
    if (!res.headersSent) {
      res.writeHead(500, {'content-type': 'application/json'});
    }
    json = {error: 'proxy_error', reason: error.message};
    res.end(JSON.stringify(json));
  });

  app.use((req, res) => {
    delete require.cache[require.resolve('../public/js/server')];
    const render = require('../public/js/server').render;

    render({
      requestUrl: req.originalUrl,
      cookies: req.cookies,
      apiHostUrl: targetUrl,
    }).then((result) => {
      if (res.status === 302) {
        res
          .redirect(result.url);
      } else {
        res
          .status(result.status)
          .send(result.body);
      }
    });
  });

  if (config.port) {
    server.listen(config.port, (err) => {
      if (err) {
        console.error(err);
      }
      console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort);
      console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
    });
  } else {
    console.error('==>     ERROR: No PORT environment variable has been specified');
  }
};

exports.setup = setup;