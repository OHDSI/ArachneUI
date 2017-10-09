/**
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
 * Created: January 20, 2017
 *
 */

import api from 'services/Api';
import {
  actionTypes,
  apiPaths
} from 'modules/CdmSourceList/const';
import { validators } from 'services/Utils';

// private

function requestSource() {
  return {
    type: actionTypes.REQUEST_DATA_SOURCE_BUSINESS,
  };
}

function receiveSource(dataSource) {
  return {
    type: actionTypes.RECEIVE_DATA_SOURCE_BUSINESS,
    payload: dataSource,
  };
}

// public

function register(id, data) {
  return () => api.doPost(
    apiPaths.registerDataSource(id),
    data,
    res => validators.checkValidationError(res)
  );
}

function load(id) {
  return (dispatch) => {
    dispatch(requestSource());
    return api.doGet(
      apiPaths.dataSourceBusiness(id),
      res => dispatch(receiveSource(res.result))
    );
  };
}

function update(id, data) {
  return () => api.doPut(
    apiPaths.dataSourceBusiness(id),
    data,
    res => validators.checkValidationError(res)
  );
}

function unregisterAtCentral(id) {

  return (dispatch) => {
    dispatch(requestSource());
    return api.doDelete(apiPaths.registerDataSource(id),{}, receiveSource);
  }
}

export default {
  register,
  load,
  update,
  unregisterAtCentral,
};
