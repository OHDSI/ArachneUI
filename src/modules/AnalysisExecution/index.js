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
 * Created: December 13, 2016
 *
 */

import { combineReducers } from 'redux';
import ducks from './ducks';

function getRoutes() {
  return require('./routes').default(); // eslint-disable-line global-require
}

function getRoutesAsChunk() {
  return (location, cb) => {
    require.ensure([], (require) => {
      cb(null, getRoutes(require));
    });
  };
}

export default {
  actions: () => ducks.actions,
  routes: () => __DEV__ ? getRoutes() : getRoutesAsChunk(),
  reducer: () => combineReducers(ducks.reducer),
};
