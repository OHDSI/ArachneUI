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
 * Authors: Pavel Grafkin
 * Created: March 14, 2018
 *
 */

import Duck from 'services/Duck';
import api from 'services/Api';
import errors from 'const/errors';
import { apiPaths } from '../const';

const coreName = 'ERM_ATLASES';

function checkConnection({ id }) {
  return dispatch => api.doPost(
    apiPaths.atlasConnection({ id }),
    {},
    (res) => {
      if (res.errorCode === errors.NO_ERROR) {
        alert(`Connection is OK. ${res.errorMessage}`);
      } else {
        alert(`Connection check failed. ${res.errorMessage}`);
      }
    }
  );
}

function clear() {
  return dispatch => dispatch({
    type: `${coreName}_FIND_FULFILLED`,
    payload: null,
  });
}

const atlases = new Duck({
  name: coreName,
  urlBuilder: apiPaths.atlases,
});

export default {
  actions: {
    ...atlases.actions,
    checkConnection,
    clear,
  },
  reducer: atlases.reducer,
};
