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
 * Created: January 16, 2017
 *
 */

import api from 'services/Api';
import omit from 'lodash/omit';
import { actionTypes, apiPaths } from '../const';

function requestList() {
  return {
    type: actionTypes.REQUEST_EXPERTS_LIST,
    payload: {},
  };
}

function recieveList(list) {
  return {
    type: actionTypes.RECIEVE_EXPERTS_LIST,
    payload: list,
  };
}

function recieveFacets(facets) {
  return {
    type: actionTypes.RECIEVE_EL_FACETS,
    payload: facets,
  };
}

function load(searchStr) {
  return (dispatch) => {
    dispatch(requestList());
    return api.doGet(
      apiPaths.expertList() + searchStr,
      (res) => {
        const data = omit(res.result, ['facets']);
        const facets = res.result.facets;
        dispatch(recieveList(data));
        dispatch(recieveFacets(facets));
      }
    );
  };
}

function updateFacets(searchStr) {
  return dispatch => api.doGet(
    apiPaths.expertList() + searchStr,
    (res) => {
      const facets = res.result.facets;
      dispatch(recieveFacets(facets));
    }
  );
}

export default {
  load,
  updateFacets,
};
