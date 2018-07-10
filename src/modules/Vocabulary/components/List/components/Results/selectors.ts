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
import * as moment from 'moment';

interface Vocabulary {
  code: string;
  id: number;
  name: string;
  available: boolean;
  update: string;
  index: number;
  isCheckable: boolean;
  isChecked: boolean;
  tableRowClass: string;
  status: string;
  clickDefault: boolean;
  required?: string;
};

const getRawVocabs = (state: Object) => get(state, 'vocabulary.vocabularies.queryResult') || [];

const getVocabs = createSelector(
    getRawVocabs,
    (rawResults: Array<Vocabulary>) => rawResults.map((vocabulary: Vocabulary, index: number) => ({
      ...vocabulary,
      update: vocabulary.update ? moment(vocabulary.update).format('DD-MMM-YYYY') : '',
      isChecked: false,
      isCheckable: vocabulary.available === true,
      // for redux-form
      index,
    })),
  );

export default {
  getVocabs,
};

export { Vocabulary };
