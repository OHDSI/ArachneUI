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
import NotFound from 'components/NotFound';
import pluralize from 'pluralize';
import AppContainer from './AppContainer';

require('styles/appContainer.scss');

const isIE = !!navigator.userAgent.match(/Trident/g) || !!navigator.userAgent.match(/MSIE/g);
if (isIE) {
  require.ensure([], (require) => {
    require('styles/fonts-base64-fallback.scss'); // eslint-disable-line global-require
  });
}

pluralize.addSingularRule(/(pe)(ople|rson)$/i, '$1rson');
pluralize.addPluralRule(/(pe)(ople|rson)$/i, '$1rsons');

function initModules(modules) {
  const initialState = {};
  const reducers = {};
  const routes = [];
  let indexRedirect;
  let menuItems = [];
  let middleware = [];
  let redirects = {};

  modules.forEach((module, moduleKey) => {
    injectActionToRoot(module.namespace, module.actions());

    if (module.reducer) {
      reducers[module.namespace] = module.reducer();
    }

    if (module.middleware) {
      middleware = middleware.concat(...module.middleware());
    }

    if (module.routes) {
      const moduleRoutes = module.routes();
      if (Array.isArray(moduleRoutes)) {
        routes.push((
          <Route path={module.path} key={moduleKey}>
            {moduleRoutes.map((route, routeKey) =>
              React.cloneElement(route, { key: routeKey })
            )}
          </Route>
        ));
      } else {
        routes.push(
          <Route path={module.path} key={moduleKey} getChildRoutes={moduleRoutes} />
        );
      }
    }

    if (module.initialState) {
      initialState[module.namespace] = module.initialState();
    }

    if (module.isRoot) {
      indexRedirect = `/${module.path}${module.indexRedirect}`;
    }

    if (module.menuItems) {
      menuItems = menuItems.concat(module.menuItems());
    }

    if (module.indexRedirect) {
      redirects[`/${module.path}`] = `/${module.path}${module.indexRedirect}`;
    }
  });

  return {
    indexRedirect,
    initialState,
    menuItems,
    middleware,
    reducers,
    routes,
    redirects,
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
      if (store.getState().auth.principal.queryResult !== null) {
        store.dispatch(actions.auth.logout(store.getState().routing.locationBeforeTransitions.pathname));
      }
    });
}

function initRootRoute({ store, routes, indexRedirect, menuItems, redirects }) {
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
            onEnter: (nextState, replace, callback) => {
              setActiveModule(route.props.path);
              if (redirects[nextState.location.pathname]) {
                replace({ pathname: redirects[nextState.location.pathname] });
              }
              callback();
            },
          }
        )
      )}
      <Route path="*" exact={true} component={NotFound} />
      <IndexRedirect to={indexRedirect} />
    </Route>
  );
}

function initRouter({ store, history, routes, indexRedirect, menuItems, redirects }) {
  return (
    <Provider store={store}>
      <Router
        history={history}
        render={(props) =>
          <ReduxAsyncConnect {...props} />
        }
      >
        {initRootRoute({ store, routes, indexRedirect, menuItems, redirects })}
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
    redirects,
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
  const router = initRouter({ store, history, routes, indexRedirect, menuItems, redirects });

  return router;
}

export function getRenderInfo({ history }) {
  const {
    indexRedirect,
    menuItems,
    middleware,
    reducers,
    routes,
    redirects,
  } = initModules(appModules);

  const rootReducer = makeRootReducer(reducers);
  const store = configureStore({ rootReducer, middleware, history });

  registerModules({ store, modules: appModules });
  const rootRoute = initRootRoute({ store, routes, indexRedirect, menuItems, redirects });

  // AppContainer.menuItems = menuItems;

  // NOTE: order is important - API goes first!
  initializeApi(store);

  return {
    store,
    rootRoute,
  };
}

export default bootstrap;
