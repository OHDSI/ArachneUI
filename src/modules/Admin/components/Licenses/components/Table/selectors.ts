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
import { License, Vocabulary } from 'modules/Admin/components/Licenses/types';
import { licenseStatuses } from 'const/vocabulary';

const getRawData = (state: Object) => get(state, 'admin.licenses.queryResult.content', []) || [];

const getLicenses = createSelector(
    getRawData,
    (rawResults: Array<any>): Array<License> => rawResults.map((license: any) => ({
      	user: {
      		id: license.user.id,
      		name: [license.user.firstName, license.user.middleName, license.user.lastName].filter(n => n).join(' '),
          email: license.user.email,
        },
      	vocabularies: license.vocabularyDTOs,
        pendingCount: license.vocabularyDTOs.filter(voc => voc.status === licenseStatuses.PENDING).length,
    })),
  );

export default {
  getLicenses,
};
