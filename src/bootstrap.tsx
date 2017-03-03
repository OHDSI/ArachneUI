import * as React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { browserHistory, Router, Route, IndexRedirect } from 'react-router';
import { syncHistoryWithStore, routerReducer as routing } from 'react-router-redux';

import AppContainer from './AppContainer';

function bootstrap() {
	const store = createStore(
	  combineReducers({
	    routing,
	  }),
	  {}
	);
	const history = syncHistoryWithStore(browserHistory, store);

	return (
		<Provider store={store}>
	    <Router history={history}>
	      <Route path="/" component={AppContainer}>
	      </Route>
	    </Router>
	  </Provider>
	);
}

export default bootstrap;
