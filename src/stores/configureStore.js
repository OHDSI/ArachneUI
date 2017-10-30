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
 * Created: December 13, 2016
 *
 */

import { createStore, compose, applyMiddleware } from 'redux';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';

const enhancers = [];

try {
  if (window) {
    enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());// eslint-disable-line no-underscore-dangle
  }
} catch (error) {
  //ignore
}
export default function configureStore({ rootReducer, middleware = [], initialState = {}, history = browserHistory }) {

  const router = routerMiddleware(history);
  const appMiddleware = [router, thunk];

  const store = createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(...appMiddleware, ...middleware),
      ...enhancers
    )
  );
  store.asyncReducers = {};
  return store;
}