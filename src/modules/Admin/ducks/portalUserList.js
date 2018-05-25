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
import keyMirror from 'keymirror';
import { apiPaths } from 'modules/Admin/const';
import { Utils } from 'services/Utils';
import ReducerFactory from 'services/ReducerFactory';

const actionCoreName = 'AD_PORTAL_USERS';
const selectUser = 'AD_PORTAL_USERS_SELECT_USER';
const selectUserIds = 'AD_PORTAL_USERS_SELECT_USER_IDS';
const batchOperation = 'AD_PORTAL_USERS_BATCH';
const addToTenants = 'AD_PORTAL_USERS_ADD_TO_TENANTS';

const selectedUsersActions = keyMirror({
  toggle: null,
  update: null,
});

const portalUsersDuck = new Duck({
  name: actionCoreName,
  urlBuilder: apiPaths.portalUsers,
});

const portalUsersIdsDuck = new Duck({
  name: selectUserIds,
  urlBuilder: apiPaths.portalUsersIds,
});

const portalUserBatchDuck = new Duck({
  name: batchOperation,
  urlBuilder: apiPaths.portalUsersBatch,
});

const portalUserAddToTenants = new Duck({
  name: addToTenants,
  urlBuilder: apiPaths.portalUsersAddToTenants,
});


function toggleUser(uuid, selected = false) {
  return {
    type: selectUser,
    mode: selectedUsersActions.toggle,
    payload: {
      [uuid]: selected,
    },
  };
}

function updateUsers({ payload }) {
  return {
    type: selectUser,
    mode: selectedUsersActions.update,
    payload: payload,
  };
}

const selectUserReducer = new ReducerFactory();
selectUserReducer.setActionHandler(selectUser, (state, action = selectedUsersActions.toggle) => ({
  ...state,
  data: action.mode === selectedUsersActions.toggle ? {
    ...state.data,
    ...action.payload,
  } : {
    ...action.payload,
  },
}));

const actions = {
  ...portalUsersDuck.actions,
  batchOperation: portalUserBatchDuck.actions.create,
  addToTenants: portalUserAddToTenants.actions.create,
  toggle: (uuid, selected) => {
    return dispatch => dispatch(toggleUser(uuid, selected));
  },
  updateSelectedUsers: (payload) => {
    return dispatch => dispatch(updateUsers(payload));
  },
  loadUserIds: portalUsersIdsDuck.actions.query,
};

const reducer = Utils.extendReducer(
  portalUsersDuck.reducer,
  {
    selectedUsers: selectUserReducer.build(),
    batchOperation: portalUserBatchDuck.reducer,
    addToTenants: portalUserAddToTenants.reducer,
    selectedUserIds: portalUsersIdsDuck.reducer,
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
