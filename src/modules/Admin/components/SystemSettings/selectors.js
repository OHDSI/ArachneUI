/**
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
 * Created: April 14, 2017
 *
 */

import { createSelector } from 'reselect';
import get from 'lodash/get';

function prepareName(name) {
  return name.replace(/\./g, '__');
}

const getRawSystemSettings = state => get(state, 'adminSettings.systemSettings.queryResult.result.list') || [];

const getSystemSettings = createSelector(
  [getRawSystemSettings],
  rawSystemSettings => rawSystemSettings.map((formData) => {
    const fieldList = [];
    const initialValues = {};

    formData.fieldList.forEach((field) => {
      fieldList.push({
        label: field.label,
        name: field.id,
        value: field.value,
        type: field.type,
      });
      initialValues[field.id] = field.type === 'checkbox' ? field.value === 'true' : field.value;
    });

    return {
      label: formData.label,
      name: prepareName(formData.name),
      fieldList,
      initialValues,
    };
  })
);

export default {
  getSystemSettings,
};
