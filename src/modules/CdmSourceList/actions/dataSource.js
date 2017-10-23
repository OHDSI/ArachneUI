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
 * Created: December 20, 2016
 *
 */

import pick from 'lodash/pick';
import api from 'services/Api';
import {
  actionTypes,
  apiPaths
} from 'modules/CdmSourceList/const';
import { validators } from 'services/Utils';

// private

function requestSource() {
  return {
    type: actionTypes.REQUEST_DATA_SOURCE,
  };
}

function receiveSource(dataSource) {
  return {
    type: actionTypes.RECEIVE_DATA_SOURCE,
    payload: dataSource,
  };
}

function updateSource() {
  return {
    type: actionTypes.UPDATE_DATA_SOURCE,
  };
}

// public

const getSourceData = data => pick(
  data,
  [
    'name',
    'dbmsType',
    'connectionString',
    'cdmSchema',
    'dbUsername',
    'dbPassword',
  ]
);

function create(data) {
  return () => api.doPost(
      apiPaths.dataSources(),
      getSourceData(data),
      (res) => {
        validators.checkValidationError(res);
      }
    );
}

function load(id, showLoader = true) {
  return (dispatch) => {
    if (showLoader) {
      dispatch(requestSource());
    }
    return api.doGet(
      apiPaths.dataSources(id),
      res => dispatch(receiveSource(res.result))
    );
  };
}

function update(id, data, showLoader = true) {
  return (dispatch) => {
    if (showLoader) {
      dispatch(requestSource());
    }
    return api.doPut(
      apiPaths.dataSources(id),
      getSourceData(data),
      (res) => {
        dispatch(updateSource());
        validators.checkValidationError(res);
      }
    );
  };
}

function reset() {
  return receiveSource({});
}

function registerAtCentral(id, metaData, showLoader = true) {
  return (dispatch) => {
    if (showLoader) {
      dispatch(requestSource());
    }
    return api.doPost(
      apiPaths.registerDataSource(id),
      metaData
    );
  };
}

export default {
  create,
  load,
  update,
  reset,
  registerAtCentral,
};
