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
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Konstantin Yaroshovets
 * Created: March 23, 2018
 *
 */

import Duck from 'services/Duck';
import { apiPaths } from '../const';

const coreName = 'CSL_ORGANIZATION';
const addNewOrganizationActionName = `${coreName}_NEW`;

const organization = new Duck({
  name: coreName,
  urlBuilder: apiPaths.organization,
});

function createOrganization({ name, id }) {
  return {
    type: addNewOrganizationActionName,
    payload: { name, id },
  };
}

function organizationReducer(state, action) {
  if (action.type === addNewOrganizationActionName) {
    return {
      ...state,
      tempData: { name: action.payload.name, id: action.payload.id },
    };
  }
  return organization.reducer(state, action);
}

function selectNewOrganization({ name, id }) {
  return dispatch => dispatch(createOrganization({ name, id }));
}

export default {
  actions: {
    ...organization.actions,
    selectNewOrganization: selectNewOrganization,
  },
  reducer: organizationReducer,
};
