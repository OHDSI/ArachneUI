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
import { combineReducers } from 'redux';
import { apiPaths } from '../const';
import { Notifier } from 'services/Notifier';

const coreName = 'ERM_ATLASES';
const connectionName = `${coreName}_CONNECTION`;

const atlases = new Duck({
  name: coreName,
  urlBuilder: apiPaths.atlases,
});

const connection = new Duck({
  name: connectionName,
  urlBuilder: () => '',
});

function startChecking() {
  return {
    type: `${connectionName}_FIND_PENDING`,
  };
}

function endChecking() {
  return {
    type: `${connectionName}_FIND_FULFILLED`,
  };
}

function checkConnection({ id }) {
  return (dispatch) => {
    dispatch(startChecking());
    api.doPost(
      apiPaths.atlasConnection({ id }),
      {},
      (res) => {
        dispatch(endChecking());
        if (res.errorCode === errors.NO_ERROR) {
          Notifier.alert({ message: `Connection is OK. ${res.errorMessage}` });
        } else {
          Notifier.alert({ message: `Connection check failed. ${res.errorMessage}` });
        }
      }
    )
  };
}

function clear() {
  return dispatch => dispatch({
    type: `${coreName}_FIND_FULFILLED`,
    payload: null,
  });
}

export default {
  actions: {
    ...atlases.actions,
    checkConnection,
    clear,
  },
  reducer: combineReducers({
    list: atlases.reducer,
    connection: connection.reducer,
  }),
};
