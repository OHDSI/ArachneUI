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
 * Created: February 15, 2017
 *
 */

import { createSelector } from 'reselect';
import get from 'lodash/get';

const getRawUserList = state => get(state, 'expertFinder.expertsList.queryResult.result.content') || [];

const getUserList = createSelector(
  [getRawUserList],
  rawUserList => rawUserList.map(user => ({
    id: user.id,
    userPic: user.userPic,
    address: user.general.address,
    affiliation: user.general.affiliation,
    name: [user.general.firstname, user.general.middlename, user.general.lastname].filter(val => !!val).join(' '),
    professionalType: user.general.professionalType.name,
    skills: user.skills,
  })),
);

export default {
  getUserList,
};
