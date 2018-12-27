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
 * Authors: Pavel Grafkin
 * Created: May 28, 2018
 *
 */

import { createSelector } from 'reselect';
import { get } from 'services/Utils';

const getRawProfessionalTypesList = state => get(state, 'auth.professionalType.queryResult.result') || [];
const getRawCountriesList = state => get(state, 'adminSettings.countries.queryResult.result') || [];
const getRawProvincesList = state => get(state, 'adminSettings.provinces.queryResult.result') || [];

const getProfessionalTypes = createSelector(
  [getRawProfessionalTypesList],
  rawProfessionalTypesList => rawProfessionalTypesList.map(type => ({
    label: type.name,
    value: type.id,
  }))
);

const getCountries = createSelector(
  [getRawCountriesList],
  rawCountriesList => rawCountriesList.map(c => ({
    label: c.name,
    value: c.isoCode,
  }))
);

const getProvinces = createSelector(
  [getRawProvincesList],
  rawProvincesList => rawProvincesList.map(p => ({
    label: p.name,
    value: p.isoCode,
  }))
);

export default {
  getProfessionalTypes,
  getCountries,
  getProvinces,
};
