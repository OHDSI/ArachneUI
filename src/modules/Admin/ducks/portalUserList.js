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
 * Created: October 02, 2017
 *
 */

import Duck from 'services/Duck';
import { apiPaths } from 'modules/Admin/const';

const actionCoreName = 'AD_PORTAL_USERS';

const portalUsersDuck = new Duck({
  name: actionCoreName,
  urlBuilder: apiPaths.portalUsers,
});

const actions = portalUsersDuck.actions;
const reducer = portalUsersDuck.reducer;

const filterName = 'portal-users-filter';

function saveFilter(filter) {
  localStorage.setItem(filterName, JSON.stringify(filter));
}

function getSavedFilter() {
  return JSON.parse(localStorage.getItem(filterName)) || {};
}

function dropFilter() {
  localStorage.removeItem(filterName);
}

export default {
  actions,
  reducer,
};
export {
  saveFilter,
  getSavedFilter,
  dropFilter,
};
