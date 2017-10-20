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
 * Created: December 14, 2016
 *
 */

import keyMirror from 'keymirror';

const forms = keyMirror({
  facetedSearch: null,
  inviteDataSource: null,
  report: null,
});

const modal = keyMirror({
  inviteDataSource: null,
  confirmDatasource: null,
});

const apiPaths = {
  dataSources: ({ id } = {}) => `/api/v1/data-sources${id ? `/${id}/extended` : ''}`,
  dataSourceComplete: ({ id }) => `/api/v1/data-sources${id ? `/${id}/complete` : ''}`,
  dataSourceBase: ({ id }) => `/api/v1/data-sources/${id}`,
  dataSourcesMetadataAttrs: () => '/api/v1/metadata/data-source/attributes',
  studies: ({ query, dataSourceId }) =>
    `/api/v1/study-management/studies/search?region=DATASOURCE&id=${dataSourceId}&query=${query}`,
  inviteDataSource: ({ studyId, dataSourceId }) =>
    `/api/v1/study-management/studies/${studyId}/data-sources/${dataSourceId}`,
  reportsList: ({ id }) => `/api/v1/achilles/datasource/${id}/reports`,
  latestCharachterization: ({ id }) => `/api/v1/achilles/datasource/${id}`,
  report: ({ id, filename, path }) =>
    `/api/v1/achilles/datasource/${id}/files/${path ? `${path}/${filename}` : filename}`,
};

const paths = {
  dataCatalog: id => `/data-catalog/data-sources${id ? `/${id}` : ''}`,
  studies: id => `/api/v1/study-management/studies${id ? `/${id}` : ''}`,
};

const imgs = {
  sidebarIco: '/img/icons/Universal_Desktop/Navigation/Arachne_Desktop_icon-Data_Catalog.png',
};

const reports = {
  DASHBOARD: 'dashboard',
  PERSON: 'person',
  OBSERVATION_PERIODS: 'observationperiods',
  DATA_DENSITY: 'datadensity',
  DEATH: 'death',
  CONDITIONS: 'conditions',
  CONDITIONERA: 'conditionera',
  OBSERVATIONS: 'observations',
  DRUGERA: 'drugeras',
  DRUG: 'drugexposures',
  PROCEDURES: 'procedures',
  VISITS: 'visits',
  ACHILLESHEEL: 'achillesheel',
};

const reportFilenames = {
  [reports.DASHBOARD]: /dashboard\.json/gi,
  [reports.PERSON]: /person\.json/gi,
  [reports.OBSERVATION_PERIODS]: /observationperiod\.json/gi,
  [reports.DATA_DENSITY]: /datadensity\.json/gi,
  [reports.DEATH]: /death\.json/gi,
  [reports.CONDITIONS]: /condition_treemap\.json/gi,
  [reports.CONDITIONERA]: /conditionera_treemap\.json/gi,
  [reports.OBSERVATIONS]: /observation_treemap\.json/gi,
  [reports.DRUGERA]: /drugera_treemap\.json/gi,
  [reports.DRUG]: /drug_treemap\.json/gi,
  [reports.PROCEDURES]: /procedure_treemap\.json/gi,
  [reports.VISITS]: /visit_treemap\.json/gi,
  [reports.ACHILLESHEEL]: /achillesheel\.json/gi,
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
};

export {
  apiPaths,
  imgs,
  forms,
  modal,
  paths,
  reports,
  reportFilenames,
  chartSettings,
  defaultTrellisSet,
  dataSourcePermissions,
};
