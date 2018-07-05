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
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka
 * Created: November 24, 2018
 *
 */

import Duck from 'services/Duck';
import { apiPaths } from '../const';

const coreName = 'CSL_DATA_NODE_OPTIONS';
const addNewDataNodeActionName = `${coreName}_NEW`;

const dataNodeOptions = new Duck({
  name: coreName,
  urlBuilder: apiPaths.dataNodeOptions,
});

function newDataNode(data) {
  return {
    type: addNewDataNodeActionName,
    payload: data,
  };
}

function dataNodeReducer(state, action) {
  if (action.type === addNewDataNodeActionName) {
    return {
      ...state,
      tempData: { name: action.payload.name, centralId: action.payload.centralId },
    };
  };
  return dataNodeOptions.reducer(state, action);
}

function selectNewDataNode({ name, centralId }) {
  return dispatch => dispatch(newDataNode({ name, centralId }));
}

export default {
  actions: {
    ...dataNodeOptions.actions,
    selectNewDataNode,
  },
  reducer: dataNodeReducer,
};
