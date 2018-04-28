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
 * Authors: Pavel Grafkin
 * Created: April 28, 2018
 *
 */

import CrudActionNameBuilder from 'services/CrudActionNameBuilder';
import ReducerFactory from 'services/ReducerFactory';

const actionName = new CrudActionNameBuilder('AD_SOLR_INDEX_BUTTONS').done().toString();

function toggleReindexState(domain, isIndexing = false) {
  return {
    type: actionName,
    payload: {
      [domain]: isIndexing,
    },
  };
}

const actions = {
  toggle: (domain, isIndexing) => {
    return dispatch => dispatch(toggleReindexState(domain, isIndexing));
  },
};
const reducer = new ReducerFactory();
reducer.setReceiveAction(actionName);
reducer.setActionHandler(actionName, (state, action) => ({
  ...state,
  data: {
    ...state.data,
    ...action.payload,
  },
  isLoading: false,
}));

export default {
  actions,
  reducer: reducer.build(),
};
