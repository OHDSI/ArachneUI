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
 * Created: December 20, 2016
 *
 */

import keyMirror from 'keymirror';

const modal = keyMirror({
  createDataSource: null,
  createDataNode: null,
});

const form = keyMirror({
  createDataSource: null,
  editSourceTechData: null,
  editSourceBusinessData: null,
  createDataNode: null,
});

const actionTypes = keyMirror({
  REQUEST_DATA_SOURCE_LIST: null,
  RECEIVE_DATA_SOURCE_LIST: null,
  //
  REQUEST_DATA_SOURCE: null,
  RECEIVE_DATA_SOURCE: null,
  UPDATE_DATA_SOURCE: null,
  //
  REQUEST_DATA_SOURCE_BUSINESS: null,
  RECEIVE_DATA_SOURCE_BUSINESS: null,
  //
  REQUEST_DATA_NODE: null,
  RECEIVE_DATA_NODE: null,
  //
  REQUEST_CDM_CHARACTERIZATION: null,
  RECEIVE_CDM_CHARACTERIZATION: null,
  //
  REQUEST_ACHILLES_RESULTS: null,
  UPDATE_ACHILLES_RESULTS: null,
});

const paths = {
  dataSources: id => `/cdm-source-list/data-sources${id ? `/${id}` : ''}`,
};

const apiPaths = {
  dataSources: id => `/api/v1/data-sources${id ? `/${id}` : ''}`,
  dataSourceBusiness: id => `/api/v1/data-sources/${id}/business`,
  registerDataSource: id => `/api/v1/data-sources/${id}/register-on-central`,
  dataNode: () => '/api/v1/datanode',
  characterization: ({ datasourceId, limit }) =>
    `/api/v1/achilles/${datasourceId}/jobs${limit ? '?size='+limit : ''}`,
  achillesResults: ({ datasourceId }) => `/api/v1/achilles/${datasourceId}/pull`,
  dbmsTypes: () => '/api/v1/data-sources/dbms-types',
};

const imgs = {
  sidebarIco: '/img/icons/Universal_Desktop/Navigation/Arachne_Desktop_icon-Data_Catalog.png',
};

const dbmsTypes = keyMirror({
  POSTGRESQL: null,
  MS_SQL_SERVER: null,
  MS_SQL_SERVER_NATIVE: null,
  REDSHIFT: null,
  ORACLE: null,
});

const dbmsTypeList = [
  {
    label: 'Postgre SQL',
    value: dbmsTypes.POSTGRESQL,
  },
  {
    label: 'Microsoft SQL Server',
    value: dbmsTypes.MS_SQL_SERVER,
  },
  {
    label: 'Microsoft SQL Server (Native auth)',
    value: dbmsTypes.MS_SQL_SERVER_NATIVE,
  },
  {
    label: 'RedShift cloud',
    value: dbmsTypes.REDSHIFT,
  },
  {
    label: 'Oracle',
    value: dbmsTypes.ORACLE,
  },
];

const cdmVersionList = [
  {
    label: 'OMOP CDM v 4.0',
    value: 'V4_0',
  },
  {
    label: 'OMOP CDM v 5.0',
    value: 'V5_0',
  },
  {
    label: 'OMOP CDM v 5.1',
    value: 'V5_1',
  },
];

const characterizationStatuses = keyMirror({
  SUCCESSFUL: null,
  FAILED: null,
  IN_PROGRESS: null,
  NOT_STARTED: null,
});

const pollTime = 5000;

export {
  actionTypes,
  apiPaths,
  form,
  imgs,
  modal,
  paths,
  cdmVersionList,
  characterizationStatuses,
  pollTime,
};
