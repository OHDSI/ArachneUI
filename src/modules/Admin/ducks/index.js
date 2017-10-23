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

import { combineReducers } from 'redux';
import adminList from './adminList';
import adminOptionList from './adminOptionList';
import portalUserConfirmEmail from './portalUserConfirmEmail';
import portalUserEnable from './portalUserEnable';
import portalUserList from './portalUserList';
import solrIndex from './solrIndex';
import systemSettings from './systemSettings';
import userOptionList from './userOptionList';
import userList from './userList';

const actions = {
  adminList: adminList.actions,
  adminOptionList: adminOptionList.actions,
  portalUserConfirmEmail: portalUserConfirmEmail.actions,
  portalUserEnable: portalUserEnable.actions,
  portalUserList: portalUserList.actions,
  solrIndex: solrIndex.actions,
  systemSettings: systemSettings.actions,
  userOptionList: userOptionList.actions,
  userList: userList.actions,
};

const reducer = combineReducers({
  adminList: adminList.reducer,
  adminOptionList: adminOptionList.reducer,
  portalUserConfirmEmail: portalUserConfirmEmail.reducer,
  portalUserEnable: portalUserEnable.reducer,
  portalUserList: portalUserList.reducer,
  solrIndex: solrIndex.reducer,
  systemSettings: systemSettings.reducer,
  userOptionList: userOptionList.reducer,
  userList: userList.reducer,
});

export default {
  actions,
  reducer,
};