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
 * Authors: Pavel Grafkin
 * Created: March 14, 2018
 *
 */

import { combineReducers } from 'redux';
import ducks from './ducks';
import { paths, imgs } from './const';

export default {
  actions: () => ducks.actions,
  routes: () => require('./routes').default(), // eslint-disable-line global-require
  reducer: () => combineReducers(ducks.reducer),
  sidebarElement: {
    ico: imgs.sidebarIco,
    name: 'Atlases',
    path: paths.atlases(),
  },
  indexRedirect: '/atlases',
};
