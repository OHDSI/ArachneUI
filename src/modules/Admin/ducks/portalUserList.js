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
 * Created: October 02, 2017
 *
 */

import Duck from 'services/Duck';
import { apiPaths } from 'modules/Admin/const';
import { Utils } from 'services/Utils';
import ReducerFactory from 'services/ReducerFactory';

const actionCoreName = 'AD_PORTAL_USERS';
const selectUser = 'AD_PORTAL_USERS_SELECT_USER';
const batchDelete = 'AD_PORTAL_USERS_BATCH_DELETE';

const portalUsersDuck = new Duck({
  name: actionCoreName,
  urlBuilder: apiPaths.portalUsers,
});

const portalUserBatchDeleteDuck = new Duck({
  name: batchDelete,
  urlBuilder: apiPaths.portalUsersBatchDelete,
});

function toggleUser(uuid, selected = false) {
  return {
    type: selectUser,
    payload: {
      [uuid]: selected,
    },
  };
}

const selectUserReducer = new ReducerFactory();
selectUserReducer.setActionHandler(selectUser, (state, action) => ({
  ...state,
  data: {
    ...state.data,
    ...action.payload,
  },
}));

const actions = {
  ...portalUsersDuck.actions,
  batchDelete: portalUserBatchDeleteDuck.actions.create,
  toggle: (uuid, selected) => {
    return dispatch => dispatch(toggleUser(uuid, selected));
  },
};

const reducer = Utils.extendReducer(
  portalUsersDuck.reducer,
  {
    selectedUsers: selectUserReducer.build(),
    batchDelete: portalUserBatchDeleteDuck.reducer,
  });

const filterName = 'portal-users-filter';

function saveFilter(filter) {
  localStorage.setItem(filterName, JSON.stringify(filter));
}

function getSavedFilter() {
  return JSON.parse(localStorage.getItem(filterName)) || {};
}

function dropFilter() {
  localStorage.removeItem(filterName);
}

export default {
  actions,
  reducer,
};
export {
  saveFilter,
  getSavedFilter,
  dropFilter,
};
