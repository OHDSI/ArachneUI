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
 * Created: July 11, 2017
 *
 */

import { types as fieldTypes } from 'const/modelAttributes';
import keyMirror from 'keymirror';

const attributeNames = keyMirror({
  name: null,
  organization: null,
  modelType: null,
  cdmVersion: null,
  deleted: null,
});

const modelTypesValues = keyMirror({
  CDM: null,
  I2B2: null,
  CDISK: null,
  OTHER: null,
});

const healthStatuses = {
  NOT_COLLECTED: {
    title: 'Not enough statistics',
    color: 'AMBER',
  },
  NOT_CONNECTED: {
    title: 'Disconnected',
    color: 'RED',
  },
  RED: {
    title: 'Disconnected',
    color: 'RED',
  },
  AMBER: {
    title: 'Unstable',
    color: 'AMBER',
  },
  GREEN: {
    title: 'Online',
    color: 'GREEN',
  },
  getTitle(status) {
    return this[status] ? this[status].title : '';
  },
  getColor(status) {
    return this[status] ? this[status].color : 'AMBER';
  },
};

const modelTypes = [
  {
    value: 'CDM',
    label: modelTypesValues.CDM,
  },
  {
    label: 'I2B2',
    value: modelTypesValues.I2B2,
  },
  {
    label: 'CDISK',
    value: modelTypesValues.CDISK,
  },
  {
    label: 'Other',
    value: modelTypesValues.OTHER,
  }];

const cdmVersionList = [
  {
    label: 'v4.0',
    value: 'V4_0',
  },
  {
    label: 'v5.0',
    value: 'V5_0',
  },
  {
    label: 'v5.1',
    value: 'V5_1',
  },
];

/**
 * @type {
    Array<{
      label: string,
      name: string,
      type: string,
      faceted: boolean,
      showInList: boolean,
      options: Array<{label: string, value: string | number}>,
      min?: number,
      max?: number,
      order?: number,
      calculated?: boolean,
    }>
  }
 */
const staticAttrList = [
  {
    label: 'Name',
    name: attributeNames.name,
    type: fieldTypes.string,
    faceted: false,
    showInList: true,
    options: null,
    order: 0,
  },
  {
    label: 'Organization',
    name: attributeNames.organization,
    type: fieldTypes.string,
    faceted: true,
    showInList: true,
    options: null,
    order: 2,
  },
  {
    label: 'Model Type',
    name: attributeNames.modelType,
    type: fieldTypes.enum,
    faceted: true,
    showInList: true,
    options: modelTypes,
    order: 2,
  },
  {
    label: 'Version',
    name: attributeNames.cdmVersion,
    type: fieldTypes.enum,
    faceted: true,
    showInList: true,
    options: cdmVersionList,
    order: 2,
  },
  {
    label: 'Deleted At',
    name: attributeNames.deleted,
    type: fieldTypes.date,
    faceted: false,
    showInList: false,
    options: null,
    calculated: true,
  },
];

export {
  healthStatuses,
  modelTypes,
  staticAttrList,
  cdmVersionList,
  modelTypesValues,
  attributeNames,
};
