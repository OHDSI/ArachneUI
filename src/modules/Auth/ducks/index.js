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
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: October 12, 2017
 *
 */

import { combineReducers } from 'redux';
import authLogin from './authLogin';
import authLogout from './authLogout';
import principal from './principal';
import authMethod from './authMethod';
import authRegister from './authRegister';
import professionalType from './professionalTypes';
import remindPassword from './remindPassword';
import resetPassword from './resetPassword';
import resendEmail from  './resendEmail';
import token from './token';
import { isAuthModulePath } from 'modules/Auth/utils';
import { LOCATION_CHANGE } from 'react-router-redux';
import passwordPolicy from './passwordPolicy';
import countries from './countries';
import provinces from './provinces';
import nodeMode from './nodeMode';

function setBackUrl(state, action) {
  return !isAuthModulePath(action.payload.pathname) ? { ...state, backUrl: action.payload.pathname } : state;
}

const authRoutingHistory = (state = {}, action) => {
      return action.type === LOCATION_CHANGE ? setBackUrl(state, action) : state;
};

const actions = {
  login: authLogin.actions.create,
  logout: authLogout.actions.create,
  clearToken: authLogout.actions.clearToken,
  principal: principal.actions,
  authMethod: authMethod.actions,
  register: authRegister.actions.create,
  professionalType: professionalType.actions,
  remindPassword: remindPassword.actions,
  resetPassword: resetPassword.actions,
  resendEmail: resendEmail.actions.create,
  token: token.actions,
  passwordPolicy: passwordPolicy.actions,
  countries: countries.actions,
  provinces: provinces.actions,
  nodeMode: nodeMode.actions,
};

const reducer = combineReducers({
  authLogin: authLogin.reducer,
  authLogout: authLogout.reducer,
  principal: principal.reducer,
  authMethod: authMethod.reducer,
  authRegister: authRegister.reducer,
  professionalType: professionalType.reducer,
  remindPassword: remindPassword.reducer,
  resetPassword: resetPassword.reducer,
  resendEmail: resendEmail.reducer,
  authRoutingHistory,
  token: token.reducer,
  passwordPolicy: passwordPolicy.reducer,
  countries: countries.reducer,
  provinces: provinces.reducer,
  nodeMode: nodeMode.reducer,
});

export default {
  actions,
  reducer,
};