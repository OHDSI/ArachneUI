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
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: December 14, 2016
 *
 */

import keyMirror from 'keymirror';
import { reports } from 'const/reports';

const forms = keyMirror({
  facetedSearch: null,
  inviteDataSource: null,
  report: null,
  editDataSource: null,
  createDataNode: null,
  modalCreateDataSource: null,
  modalStatsUpload: null,
  editDataNodeTitle: null,
  editDataNode: null,
  editCommonData: null,
});

const modal = keyMirror({
  inviteDataSource: null,
  confirmDatasource: null,
  modalCreateDatanode: null,
  modalCreateDataSource: null,
  modalStatsUpload: null,
  editDataNodeTitle: null,
});

const apiPaths = {
  dataSources: ({ id } = {}) => `/api/v1/data-sources${id ? `/${id}/extended` : ''}`,
  dataSourceComplete: ({ id }) => `/api/v1/data-sources${id ? `/${id}/complete` : ''}`,
  dataSourceBase: ({ id }) => `/api/v1/data-sources/${id}`,
  dataSourceCreate: ({ dataNodeId }) => `/api/v1/data-nodes/${dataNodeId}/data-sources`,
  dataSourcesMetadataAttrs: () => '/api/v1/metadata/data-source/attributes',
  studies: ({ query, dataSourceId }) =>
    `/api/v1/study-management/studies/search?region=DATASOURCE&id=${dataSourceId}&query=${query}`,
  inviteDataSource: ({ studyId, dataSourceId }) =>
    `/api/v1/study-management/studies/${studyId}/data-sources/${dataSourceId}`,
  reportsList: ({ id }) => `/api/v1/achilles/datasource/${id}/reports`,
  latestCharachterization: ({ id }) => `/api/v1/achilles/datasource/${id}`,
  report: ({ id, filename, path }) =>
    `/api/v1/achilles/datasource/${id}/files/${path ? `${path}/${filename}` : filename}`,
  myDatasources: () => '/api/v1/data-sources/my',
  dataNode: ({ id }) => `/api/v1/data-nodes${id ? `/${id}` : ''}`,
  dataNodeCreate: () => `/api/v1/data-nodes/manual`,
  dataNodeOptions: () => `/api/v1/data-nodes/suggest`,
  dataNodeSources: ({ id }) => `/api/v1/data-nodes/${id}/data-sources`,
  registerDataSource: ({ id }) => `/api/v1/data-sources/${id}/register-on-central`,
  registration: ({ id }) => `/api/v1/data-sources/${id}/registration`,
  dbmsTypes: () => '/api/v1/data-sources/dbms-types',
  achillesResultsUpload: ({ id }) => `/api/v1/achilles/datanode/datasource/${id}`,
  organization: ({ id }) => `/api/v1/user-management/organizations${id ? `/${id}` : ''}`,
};

const paths = {
  dataCatalog: id => `/data-catalog/data-sources${id ? `/${id}` : ''}`,
  dataNode: id => `/data-catalog/data-nodes${id ? `/${id}` : ''}`,
  studies: id => `/api/v1/study-management/studies${id ? `/${id}` : ''}`,
  myDatasources: () => '/data-catalog/my-data-sources',
  edit: id => `/data-catalog/data-sources/${id}/edit`,
};

const imgs = {
  sidebarIco: '/img/icons/Universal_Desktop/Navigation/Arachne_Desktop_icon-Data_Catalog.png',
};

const reportFilenames = {
  [reports.dashboard]: /dashboard\.json/i,
  [reports.person]: /person\.json/i,
  [reports.observationperiods]: /observationperiod\.json/i,
  [reports.datadensity]: /datadensity\.json/i,
  [reports.death]: /death\.json/i,
  [reports.conditions]: /condition_treemap\.json/i,
  [reports.conditionera]: /conditionera_treemap\.json/i,
  [reports.observations]: /observation_treemap\.json/i,
  [reports.drugeras]: /drugera_treemap\.json/i,
  [reports.drugexposures]: /drug_treemap\.json/i,
  [reports.procedures]: /procedure_treemap\.json/i,
  [reports.visits]: /visit_treemap\.json/i,
  [reports.achillesheel]: /achillesheel\.json/i,
  [reports.measurement]: /measurement_treemap\.json/i,
};

const chartSettings = {
  margin: {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
  },
};

const defaultTrellisSet = [
  '0-9', '10-19', '20-29', '30-39', '40-49',
  '50-59', '60-69', '70-79', '80-89', '90-99',
];

const dataSourcePermissions = {
  delete: 'DELETE_DATASOURCE',
  edit: 'EDIT_DATASOURCE',
};

const dataNodePermissions = {
  create: 'CREATE_DATANODE',
  edit: 'EDIT_DATANODE',
};

export {
  apiPaths,
  imgs,
  forms,
  modal,
  paths,
  reportFilenames,
  chartSettings,
  defaultTrellisSet,
  dataSourcePermissions,
  dataNodePermissions,
};
