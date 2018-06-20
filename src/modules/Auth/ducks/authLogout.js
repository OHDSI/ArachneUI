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
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: October 12, 2017
 *
 */

import Duck from 'services/Duck';
import { apiPaths, paths, actionTypes } from 'modules/Auth/const';
import AuthService from 'services/Auth';
import actionsGlobal from 'actions';
import { isAuthModulePath } from 'modules/Auth/utils';
import { push as goToPage } from 'react-router-redux';
import URI from 'urijs';

const actionCoreName = 'AU_AUTH_LOGOUT';

const authLogoutDuck = new Duck(
  {
    name: actionCoreName,
    urlBuilder: apiPaths.logout,
  },
);

function removePrincipal() {
  return {
    type: actionTypes.AU_PRINCIPAL_QUERY_FULFILLED,
    payload: null,
  };
}

const actions = authLogoutDuck.actions;
const reducer = authLogoutDuck.reducer;

function clearToken(backurl = '/', dispatch) {
  AuthService.clearToken();
  dispatch(removePrincipal());
  if (actionsGlobal.studyManager) {
    actionsGlobal.studyManager.studyList.dropFilter();
  }
  // Redirect to auth screen if not already there
  const uri = new URI(backurl);
  if (!isAuthModulePath(uri.pathname())) {
    dispatch(goToPage(paths.login()));
  }
}

export default {
  actions: {
    create: (backurl = '/') => {
      return (dispatch) => {
        dispatch(actions.create()).then(() => clearToken(backurl, dispatch));
      };
    },
    clearToken: (backurl = '/') => {
      return dispatch => clearToken(backurl, dispatch);
    },
  },
  reducer,
};
