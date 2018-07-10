/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexandr Saltykov, Pavel Grafkin, Vitaly Koulakov, Anton Gackovka
 * Created: March 3, 2017
 *
 */

import { createSelector } from 'reselect';
import { get } from 'lodash';
import { VocabularyOption } from 'modules/Admin/components/Licenses/types';

type UserOption = {
	label: string;
	value: number;
};

const getRawVocs = (state: Object) => get(state, 'admin.vocabularies.queryResult', []) || [];
const getRawUsers = (state: Object) => get(state, 'admin.users.queryResult', []) || [];

const getVocabularies = createSelector(
    getRawVocs,
    (rawResults: Array<any>): Array<VocabularyOption> => rawResults.filter(voc => voc.required).map((voc) => ({
      label: voc.name,
      value: voc.id,
    })),
);

const getUsers = createSelector(
	getRawUsers,
	(rawUsers: Array<any>): Array<UserOption> => rawUsers.map(user => ({
		label: [user.firstName, user.middleName, user.lastName].filter(n => n).join(' '),
		value: user.id,
	}))
);

export default {
  getVocabularies,
  getUsers,
};
export {
	UserOption,
};
