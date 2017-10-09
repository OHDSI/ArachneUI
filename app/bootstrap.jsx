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
 * Created: December 28, 2016
 *
 */

import { browserHistory, Router, Route, IndexRedirect } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect } from 'redux-async-connect';

import AuthService from 'services/Auth';
import appModules from 'modules/index';
import configureStore from 'stores/configureStore';
import actions, { injectAction as injectActionToRoot } from 'actions/index';
import ApiService from 'services/Api';
import makeRootReducer from 'reducers/index';
import { Provider } from 'react-redux';
import React from 'react';
import AppContainer from './AppContainer';

require('styles/appContainer.scss');

function initModules(modules) {
  const initialState = {};
  const reducers = {};
  const routes = [];
  let indexRedirect;
  let menuItems = [];
  let middleware = [];

  modules.forEach((module, moduleKey) => {
    injectActionToRoot(module.namespace, module.actions());

    if (module.reducer) {
      reducers[module.namespace] = module.reducer();
    }

    if (module.middleware) {
      middleware = middleware.concat(...module.middleware());
    }

    if (module.routes) {
      routes.push((
        <Route path={module.path} key={moduleKey}>
          {module.routes().map((route, routeKey) =>
            React.cloneElement(route, { key: routeKey })
          )}
        </Route>
      ));
    }

    if (module.initialState) {
      initialState[module.namespace] = module.initialState();
    }

    if (module.isRoot) {
      indexRedirect = module.path;
    }

    if (module.menuItems) {
      menuItems = menuItems.concat(module.menuItems());
    }
  });

  return {
    indexRedirect,
    initialState,
    menuItems,
    middleware,
    reducers,
    routes,
  };
}

function registerModules({ store, modules }) {
  modules.forEach((module) => {
    const action = actions.modules.register({
      path: module.path,
      sidebar: module.sidebarElement,
      sidebarPath: module.sidebarPath,
      isAdminOnly: module.isAdminOnly,
    });
    store.dispatch(action);
  });
}

function unregisterModules(store) {
  store.dispatch(actions.modules.unregisterAll());
}

/**
 * Initializes Router history.
 */
function initBrowserHistory(store) {
  const history = syncHistoryWithStore(browserHistory, store);
  return history;
}

/**
 * Initialize API
 */
function initializeApi(store) {
  ApiService
    .setUserTokenGetter(() => AuthService.getToken())
    .setUnauthorizedHandler(() => {
      // TODO
      store.dispatch(actions.auth.auth.logout(store.getState().routing.locationBeforeTransitions.pathname));
    });
}

function initRootRoute({ store, routes, indexRedirect, menuItems }) {
  const setActiveModule = (module) => {
    const action = actions.modules.setActive(module);
    store.dispatch(action);
  };

  return (
    <Route path="/" component={AppContainer(menuItems)}>
      {routes.map((route, key) =>
        React.cloneElement(
          route,
          {
            key,
            onEnter: () => setActiveModule(route.props.path),
          }
        )
      )}
      <IndexRedirect to={indexRedirect} />
    </Route>
  );
}

function initRouter({ store, history, routes, indexRedirect, menuItems }) {
  return (
    <Provider store={store}>
      <Router
        history={history}
        render={(props) =>
          <ReduxAsyncConnect {...props} />
        }
      >
        {initRootRoute({ store, routes, indexRedirect, menuItems })}
      </Router>
    </Provider>
  );
}

function bootstrap() {
  let {
    indexRedirect,
    initialState,
    menuItems,
    middleware,
    reducers,
    routes,
  } = initModules(appModules);

  const dataFromServer = window.__data;
  if (dataFromServer) {
    initialState = { ...initialState, ...dataFromServer };
  }

  const rootReducer = makeRootReducer(reducers);
  const store = configureStore({ rootReducer, middleware, initialState });

  unregisterModules(store);
  registerModules({ store, modules: appModules });
  
  // NOTE: order is important - API goes first!
  initializeApi(store);
  
  const history = initBrowserHistory(store);
  const router = initRouter({ store, history, routes, indexRedirect, menuItems });

  return router;
}

export function getRenderInfo({ history }) {
  const {
    indexRedirect,
    menuItems,
    middleware,
    reducers,
    routes,
  } = initModules(appModules);

  const rootReducer = makeRootReducer(reducers);
  const store = configureStore({ rootReducer, middleware, history });

  registerModules({ store, modules: appModules });
  const rootRoute = initRootRoute({ store, routes, indexRedirect, menuItems });

  // AppContainer.menuItems = menuItems;

  // NOTE: order is important - API goes first!
  initializeApi(store);

  return {
    store,
    rootRoute,
  };
}

export default bootstrap;
