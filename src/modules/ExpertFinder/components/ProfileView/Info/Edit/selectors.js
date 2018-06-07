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
 * Created: January 20, 2017
 *
 */

import { createSelector } from 'reselect';
import get from 'lodash/get';

const getRawTypes = state => get(state, 'expertFinder.professionalTypes.queryResult.result') || [];

const getProfessionalTypes = createSelector(
  [getRawTypes],
  rawList => rawList.map(type => ({
    value: type.id,
    label: type.name,
  }))
);

export default {
  getProfessionalTypes,
};