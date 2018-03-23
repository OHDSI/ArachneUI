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

const organization = new Duck({
  name: coreName,
  urlBuilder: apiPaths.organization,
});

function createOrganization(name) {
  return {
    type: 'CSL_ORGANIZATION_NEW',
    payload: { name },
  };
}

function handleNewOrganiztion(state, action) {
  if (action.type === 'CSL_ORGANIZATION_NEW') {
    return {
      ...state,
      data: [
        ...state.data,
        { ...action.payload, id: -1 },
      ],
    };
  }
  ;
  return organization.reducer(state, action);
}

function selectNewOrganization(name) {
  return dispatch => dispatch(createOrganization(name));
}

export default {
  actions: {
    ...organization.actions,
    selectNewOrganization: selectNewOrganization,
  },
  reducer: handleNewOrganiztion,
};
