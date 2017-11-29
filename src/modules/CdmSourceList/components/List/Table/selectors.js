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
 * Created: December 20, 2016
 *
 */

import { createSelector } from 'reselect';
import get from 'lodash/get';

const getDbmsTypeList = state => get(state, 'cdmSourceList.dbmsTypes.queryResult', [], 'Array');
const getRawDataSourceList = state => get(state, 'cdmSourceList.dataSourceList.queryResult.result', [], 'Array');

const getDataSourceList = createSelector(
  [getRawDataSourceList, getDbmsTypeList],
  (dataSourceList, dbmsTypeList) => dataSourceList.map(item => ({
    id: item.id,
    name: item.name,
    dbmsType: get(dbmsTypeList.find(el => el.value === item.dbmsType), 'label'),
    connectionString: item.connectionString,
    cdmSchema: item.cdmSchema,
    isRegistered: item.isRegistred,
    modelType: item.modelType,
    healthStatus: {
      value: item.healthStatusDescription,
      title: item.healthStatus,
    },
  }))
);

const getTestDataSourceList = () => ([
  {
    id: 1,
    name: 'Data Source Name 1',
    dbmsType: 'SQL Server',
    dbName: 'db',
    cdmSchema: 'public',
    isRegistered: true,
    modelType: 'CDM',
  },
  {
    id: 2,
    name: 'Data Source Name 2',
    dbmsType: 'MySQL',
    dbName: 'cdm',
    cdmSchema: 'public',
    isRegistered: false,
    modelType: 'OTHER',
  },
  {
    id: 3,
    name: 'Data Source Name 3',
    dbmsType: 'Oracle',
    dbName: 'new_cdm',
    cdmSchema: 'custom',
    isRegistered: true,
    modelType: 'CDM',
  },
]);

export default {
  getDataSourceList,
  getTestDataSourceList,
};
