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

import api from 'services/Api';
import { apiPaths, actionTypes } from 'modules/CdmSourceList/const';

// private

function requestSources() {
  return {
    type: actionTypes.REQUEST_DATA_SOURCE_LIST,
  };
}

function receiveSources(dataSourceList) {
  return {
    type: actionTypes.RECEIVE_DATA_SOURCE_LIST,
    payload: dataSourceList,
  };
}

// public

function load(query) {
  return (dispatch) => {
    dispatch(requestSources());
    return api.doGet(
      apiPaths.dataSources(),
      query,
      res => dispatch(receiveSources(res.result))
    );
  };
}

export default {
  load,
};
