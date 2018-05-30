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
 * Created: September 29, 2017
 *
 */

import { createSelector } from 'reselect';
import get from 'lodash/get';

const getRawUserList = state => get(state, 'adminSettings.portalUserList.queryResult.content') || [];
const getRawSelectedUsers = state => get(state, 'adminSettings.portalUserListSelectedUsers.data') || [];

const getUserList = createSelector(
  [getRawUserList],
  rawUserList =>
    rawUserList.map(item => ({
      ...item,
      name: [
        item.firstname || '',
        item.middlename || '',
        item.lastname || '',
      ].filter(o => o).join(' '),
      tenantNames: item.activeTenant ? [
        item.activeTenant.name, 
        ...item.tenants.filter(v => v.id !== item.activeTenant.id).map(v => v.name)
      ].join(',') : item.tenants.map(v => v.name).join(','),

    }))
);

// Has two additional usages : ActionsToolbar, ModalAddUsersToTenants
const getSelectedUsers = createSelector(
  [getRawSelectedUsers],
  rawSelectedUser => Object.entries(rawSelectedUser).filter(([uuid, flag]) => flag).map(([uuid, flag]) => uuid),
);

export default {
  getUserList,
  getSelectedUsers,
};
