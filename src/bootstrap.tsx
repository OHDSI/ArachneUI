import * as React from 'react';
import * as get from 'lodash/get';
import { ReactElement } from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { browserHistory, Router, RouteConfig, PlainRoute, RouteComponent } from 'react-router';
import { syncHistoryWithStore, routerReducer as routing } from 'react-router-redux';

import configureStore from 'stores/configureStore';
import { IStoreAsync, injectReducer } from 'stores/configureStore';
import { configure as configureApi } from 'services/Api';
import IModule from './modules/IModule';
import AppContainer from './AppContainer';
import { injectAction } from 'actions';
import modulesActions from 'actions/modules';
import { IModuleMetadata } from 'actions/modules';
import { indexRoute as modulesIndexRoute, modules } from './modules';

import { authTokenName } from 'const';
import authActions from 'modules/Auth/actions';


import { push as goToPage } from 'react-router-redux';
const ssoLoginUrl = '/auth/login';

let globalStore: IStoreAsync;

function buildRoutes(
	container: RouteComponent,
	indexRoute: PlainRoute,
	moduleRouteList: PlainRoute[]
): RouteConfig {
	const routes: PlainRoute = {
	  path: '/',
	  component: container,
	  indexRoute,
	  childRoutes: moduleRouteList,
	};

	return routes;
}

function registerModule(moduleMetadata: IModuleMetadata) {
	globalStore.dispatch(
		modulesActions.register(moduleMetadata)
	);
}

function setActiveModule(activeModulePath: string) {
	globalStore.dispatch(
		modulesActions.setActive(activeModulePath)
	);
}

function initModule(module: IModule): RouteConfig {
	// Inject module's action creators
	if (module.actions) {
		injectAction(module.namespace, module.actions());
	}
	// Inject module's reducer
	if (module.reducer) {
		injectReducer(globalStore, module.namespace, module.reducer());
	}
	// TODO: Inject reducer together with reducers
	//
	// Fire action when module is activated
	const moduleRoute = module.rootRoute();
	moduleRoute.onEnter = (nextState, replace) => setActiveModule(moduleRoute.path);
	// Register module in store
	registerModule({
		path: moduleRoute.path,
		navbarElement: module.navbarElement,
		sidebarElement: module.sidebarElement,
	});
	// Return module's Route
	return moduleRoute;
}

function buildStore() {
	return configureStore({});
}

function bootstrap() {
	const store = globalStore = buildStore();
	const history = syncHistoryWithStore(browserHistory, store);

	const getAuthToken = function() {
		return get(store.getState(), 'auth.core.token');
	};

	const onAccessDenied = function() {
		const backUrl = window.location.href;
		store.dispatch(
			authActions.core.setBackUrl(backUrl)
		);
		store.dispatch(
      goToPage(ssoLoginUrl)
    );
	};

	return configureApi({ getAuthToken, onAccessDenied }).then(() => {
		const modulesRoutes: PlainRoute[] = modules.map(initModule);
		const appRoutes: RouteConfig = buildRoutes(AppContainer, modulesIndexRoute, modulesRoutes);
		const cachedAuthToken = window.localStorage.getItem(authTokenName);

		if (cachedAuthToken) {
			store.dispatch(authActions.core.setToken(cachedAuthToken));
		}

		return (
			<Provider store={store}>
		    <Router routes={appRoutes} history={history} />
		  </Provider>
		);
	});	
}

export default bootstrap;
