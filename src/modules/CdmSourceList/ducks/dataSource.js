/*
 *
 * Copyright 2018 Observational Health Data Sciences and Informatics
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
 * Created: November 24, 2017
 *
 */

import Duck from 'services/Duck';
import { apiPaths } from '../const';
import { buildFormData } from 'services/Utils';
import omit from 'lodash/omit';

const coreName = 'CSL_DS';

function clearSource() {
  return {
    type: `${coreName}_QUERY_FULFILLED`,
    payload: null,
  };
}

const dataSource = new Duck({
  name: coreName,
  urlBuilder: apiPaths.dataSources,
});

const actions = dataSource.actions;
const _create = actions.create;
const _update = actions.update;
const dsBlob = (data) => new Blob(
  [ JSON.stringify(omit(data, 'krbKeytab')), ],
  { type: 'application/json' },
);
const formData = data => buildFormData({dataSource: dsBlob(data), krbKeytab: data.krbKeytab ? data.krbKeytab[0] : null});
actions.create = (urlParams, data) => _create(urlParams, formData(data));
actions.update = (urlParams, data) => _update(urlParams, formData(data));

export default {
  actions: {
    ...actions,
    reset: (dispatch) => dispatch(clearSource()),
  },
  reducer: dataSource.reducer,
};
