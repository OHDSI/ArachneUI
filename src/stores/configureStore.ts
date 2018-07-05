/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexandr Saltykov, Pavel Grafkin, Vitaly Koulakov, Anton Gackovka
 * Created: March 3, 2017
 *
 */

import { createStore, compose, applyMiddleware, Reducer, Middleware, Store, GenericStoreEnhancer } from 'redux';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import reduxPromiseMiddleware from 'redux-promise-middleware'; // for feathersjs
import createAppReducer from 'reducers';

const router = routerMiddleware(browserHistory);

const appMiddleware: Middleware[] = [thunk, router, reduxPromiseMiddleware()];

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