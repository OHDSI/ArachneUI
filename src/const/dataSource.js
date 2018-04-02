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
 * Created: July 11, 2017
 *
 */

import { types as fieldTypes } from 'const/modelAttributes';
import keyMirror from 'keymirror';
import { get } from 'services/Utils';

import {
  FormInput,
  FormSelect,
} from 'arachne-ui-components';
import PasswordField from 'components/PasswordField/connected';

const attributeNames = keyMirror({
  name: null,
  organization: null,
  modelType: null,
  cdmVersion: null,
  deleted: null,
  targetSchema: null,
  resultSchema: null,
  cohortTargetTable: null,
  dbmsType: null,
  executionPolicy: null,
});

const modelTypesValues = keyMirror({
  CDM: null,
  I2B2: null,
  CDISK: null,
  OTHER: null,
});

const executionPolicy = keyMirror({
  MANUAL: null,
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
    label: '4.0',
    value: 'V4_0',
  },
  {
    label: '5.0.0',
    value: 'V5_0',
  },
  {
    label: '5.0.1',
    value: 'V5_0_1',
  },
  {
    label: '5.1',
    value: 'V5_1',
  },
  {
    label: '5.2',
    value: 'V5_2',
  },
  {
    label: '5.3',
    value: 'V5_3',
  },
];

/**
 * @type {
    Array<{
      label: string,
      name: string,
      type: string,
      getter?: function,
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
    isRequired: true,
  },
  {
    label: 'DBMS Type',
    name: attributeNames.dbmsType,
    type: fieldTypes.enum,
    faceted: false,
    showInList: false,
    options: null,
    order: 1,
    isRequired: true,
    onlyManual: true,
  },
  {
    label: 'Organization',
    name: 'organization',
    type: fieldTypes.string,
    getter: ds => get(ds, 'dataNode.organization.name'),
    faceted: true,
    showInList: true,
    options: null,
    order: 2,
    isRequired: true,
    calculated: true,
  },
  {
    label: 'Model Type',
    name: attributeNames.modelType,
    type: fieldTypes.enum,
    isMulti: true,
    faceted: true,
    showInList: true,
    options: modelTypes,
    order: 2,
    isRequired: true,
  },
  {
    label: 'Version',
    name: attributeNames.cdmVersion,
    type: fieldTypes.enum,
    isMulti: true,
    faceted: true,
    showInList: true,
    options: cdmVersionList,
    order: 2,
    isRequired: true,
    cdmSpecific: true,
  },
  {
    label: 'Deleted At',
    name: attributeNames.deleted,
    type: fieldTypes.date,
    faceted: false,
    showInList: false,
    options: null,
    calculated: true,
    isRequired: true,
  },
];

const cdmSpecificAttributes = [
  {
    label: 'Target Schema',
    name: attributeNames.targetSchema,
    type: fieldTypes.string,
    faceted: false,
    showInList: false,
    options: null,
    order: 2,
  },
  {
    label: 'Result Schema',
    name: attributeNames.resultSchema,
    type: fieldTypes.string,
    faceted: false,
    showInList: false,
    options: null,
    order: 2,
  },
  {
    label: 'Cohort Target Table',
    name: attributeNames.cohortTargetTable,
    type: fieldTypes.string,
    faceted: false,
    showInList: false,
    options: null,
    order: 2,
  },
];

const immutableAttributes = [
  attributeNames.name,
];

const fieldHints = {
};

function getDataSourceCreationFields(dbmsTypeList, useOnlyVirtual = false) {
  const virtualSourceFields = [
    {
      name: 'name',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Name of data source',
          required: true,
          type: 'text',
          title: 'General',
        },
      },
    },
    {
      name: 'dbmsType',
      InputComponent: {
        component: FormSelect,
        props: {
          mods: ['bordered'],
          placeholder: 'DBMS Type',
          options: dbmsTypeList,
          required: true,
        },
      },
    },
  ];
  const physicalSourceFields = [
    ...virtualSourceFields,
    {
      name: 'connectionString',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Connection string',
          required: true,
          type: 'text',
        },
      },
    },
    {
      name: 'cdmSchema',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'CDM schema name',
          required: true,
          type: 'text',
        },
      },
    },
    {
      name: 'dbUsername',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Username',
          required: true,
          type: 'text',
        },
      },
    },
    {
      name: 'dbPassword',
      InputComponent: {
        component: PasswordField,
        props: {
          mods: ['bordered'],
          showHint: false,
          placeholder: 'Password',
          required: true,
          type: 'password',
        },
      },
    },
    ...cdmSpecificAttributes.map((attribute, index) => ({
      name: attribute.name,
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: attribute.label,
          title: index === 0 ? 'CDM settings' : null,
        },
      },
    })),
  ];

  return useOnlyVirtual ? virtualSourceFields : physicalSourceFields;
}

export {
  healthStatuses,
  modelTypes,
  staticAttrList,
  cdmVersionList,
  modelTypesValues,
  attributeNames,
  immutableAttributes,
  fieldHints,
  cdmSpecificAttributes,
  getDataSourceCreationFields,
  executionPolicy,
};
