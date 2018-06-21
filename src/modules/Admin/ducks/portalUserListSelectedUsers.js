/*
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
 * Authors: Anton Gackovka
 * Created: May 29, 2018
 */

import Duck from 'services/Duck';
import keyMirror from 'keymirror';
import { apiPaths } from 'modules/Admin/const';
import { Utils } from 'services/Utils';
import ReducerFactory from 'services/ReducerFactory';

const selectUser = 'AD_PORTAL_USERS_SELECT_USER';
const selectUserIds = 'AD_PORTAL_USERS_SELECT_USER_IDS';

const selectedUsersActions = keyMirror({
  toggle: null,
  update: null,
});

const portalUsersIdsDuck = new Duck({
  name: selectUserIds,
  urlBuilder: apiPaths.portalUsersIds,
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

function updateUserIds({ payload }) {
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
  toggle: (uuid, selected) => {
    return dispatch => dispatch(toggleUser(uuid, selected));
  },
  updateSelectedUsers: (payload) => {
    return dispatch => dispatch(updateUserIds({ payload }));
  },
  loadUserIds: portalUsersIdsDuck.actions.query,
};

const reducer = Utils.extendReducer(
  selectUserReducer.build(),
  {
    allUserIds: portalUsersIdsDuck.reducer,
  });

export default {
  actions,
  reducer,
};