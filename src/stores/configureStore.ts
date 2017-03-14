import { createStore, compose, applyMiddleware, Reducer, Middleware, Store, GenericStoreEnhancer } from 'redux';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import reduxPromiseMiddleware from 'redux-promise-middleware'; // for feathersjs
import * as createLogger from 'redux-logger';
import createAppReducer from 'reducers';

const logger = createLogger();
const router = routerMiddleware(browserHistory);

const appMiddleware: Middleware[] = [thunk, router, reduxPromiseMiddleware(), logger];

interface IStoreAsync extends Store<any> {
  asyncReducers: {[key: string]: Reducer<any>};
};

export default function configureStore(
  initialState: Object = {},
  middlewareList: Middleware[] = []
) {
  const middlewareEnhancer = applyMiddleware(...appMiddleware, ...middlewareList);
  let enhancer = middlewareEnhancer;
  
  if (window && (<any> window).__REDUX_DEVTOOLS_EXTENSION__) {
    enhancer = compose(middlewareEnhancer, (<any> window).__REDUX_DEVTOOLS_EXTENSION__());
  }

  const store = <IStoreAsync> createStore(
    createAppReducer({}),
    initialState,
    enhancer
  );
  store.asyncReducers = {};
  return store;
}

function injectReducer(
  store: IStoreAsync,
  name: string,
  asyncReducer: Reducer<any>
) {
  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(createAppReducer(store.asyncReducers));
}

export {
  IStoreAsync,
  injectReducer,
}