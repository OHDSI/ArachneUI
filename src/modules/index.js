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
 * Created: December 13, 2016
 *
 */

/* eslint-disable global-require */

import Auth from './Auth/index';

const modules = [];

const Portal = require('./Portal/index').default;
const Admin = require('./Admin/index').default;

modules.push({
  ...Portal,
  path: 'portal',
  namespace: 'portal',
  isAdminOnly: false,
});

if (__APP_TYPE_CENTRAL__) {
  const StudyManager = require('./StudyManager/index').default;
  const AnalysisExecution = require('./AnalysisExecution/index').default;
  const ExpertFinder = require('./ExpertFinder/index').default;
  const DataCatalog = require('./DataCatalog/index').default;
  const InsightsLibrary = require('./InsightsLibrary').default;

  const Workspace = require('./Workspace/index').default;

  modules.push({
    ...Workspace,
    path: 'workspace',
    namespace: 'workspace',
    isRoot: true,
    isAdminOnly: false,
  });
  
  modules.push({
    ...StudyManager,
    path: 'study-manager',
    namespace: 'studyManager',
    isRoot: true,
    isAdminOnly: false,
  });

  modules.push({
    ...AnalysisExecution,
    path: 'analysis-execution',
    namespace: 'analysisExecution',
    // TODO
    sidebarPath: 'study-manager',
    isAdminOnly: false,
  });

  modules.push({
    ...ExpertFinder,
    path: 'expert-finder',
    namespace: 'expertFinder',
    isAdminOnly: false,
  });

  modules.push({
    ...DataCatalog,
    path: 'data-catalog',
    namespace: 'dataCatalog',
    isAdminOnly: false,
  });

  modules.push({
    ...InsightsLibrary,
    path: 'insights-library',
    namespace: 'insightsLibrary',
    isAdminOnly: false,
  });

  modules.push({
    ...Admin,
    routes: () => (location, cb) => {
      require.ensure([], (require) => {
        cb(null, require('modules/Admin/routesCentral').default.build()); // eslint-disable-line global-require
      });
    },
    path: 'admin-settings',
    namespace: 'adminSettings',
    isAdminOnly: true,
  });
}

if (__APP_TYPE_NODE__) {
  const CdmSourceList = require('./CdmSourceList/index').default;
  const ExternalResourceManager = require('./ExternalResourceManager').default;

  modules.push({
    ...CdmSourceList,
    path: 'cdm-source-list',
    namespace: 'cdmSourceList',
    isRoot: true,
  });

  modules.push({
    ...ExternalResourceManager,
    path: 'external-resource-manager',
    namespace: 'externalResourceManager',
  });

  modules.push({
    ...Admin,
    routes: () => (location, cb) => {
      require.ensure([], (require) => {
        cb(null, require('modules/Admin/routesNode').default.build()); // eslint-disable-line global-require
      });
    },
    path: 'admin-settings',
    namespace: 'adminSettings',
    isAdminOnly: true,
  });
}

modules.push({
  ...Auth,
  path: '/auth',
  namespace: 'auth',
});

export default modules;
