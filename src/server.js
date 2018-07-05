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
 * Created: July 11, 2017
 *
 */

global.fetch = require('node-fetch');

import React from 'react';
import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect, loadOnServer } from 'redux-async-connect';
import createHistory from 'react-router/lib/createMemoryHistory';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/server';
import { match } from 'react-router';
import PrettyError from 'pretty-error';

import Html from 'helpers/Html';
import Auth, { COOKIE_TOKEN_KEY } from 'services/Auth';
import ApiService from 'services/Api';
import { getRenderInfo } from './bootstrap';

const pretty = new PrettyError();

function render({
  requestUrl = '/',
  cookies = {},
  apiHostUrl = 'http://localhost:8080',
}) {
  ApiService.setApiHost(apiHostUrl);
  Auth.getToken = () => cookies[COOKIE_TOKEN_KEY];

  return new Promise((resolve, reject) => {
    const memoryHistory = createHistory(requestUrl);
    const renderInfo = getRenderInfo({ history: memoryHistory });
    const store = renderInfo.store;
    const history = syncHistoryWithStore(memoryHistory, store);
    const routes = renderInfo.rootRoute;

    match(
      { history, routes, location: requestUrl },
      (error, redirectLocation, renderProps) => {
        if (redirectLocation) {
          resolve({
            status: 302,
            url: redirectLocation.pathname + redirectLocation.search,
          });
        } else if (error) {
          resolve({
            status: 500,
            body: pretty.render(error),
          });
        } else if (renderProps) {
          loadOnServer({ ...renderProps, store }).then(() => {
            const component = (
  <Provider store={store} key="provider">
    <ReduxAsyncConnect {...renderProps} />
  </Provider>
            );
            resolve({
              status: 200,
              body: `<!doctype html>\n${ReactDOM.renderToString(<Html component={component} store={store} />)}`,
            });
          });
        } else {
          resolve({
            status: 404,
            body: 'Not found',
          });
        }
      }
    );
  });
}


export { render };
