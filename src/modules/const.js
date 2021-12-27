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
 * Authors: Sergey Suvorov
 * Created: September 30, 2021
 *
 */

const apiPaths = {
  disabledModules: () => '/api/v1/modules/disabled-modules',
};

const modulePaths = {
  workspace: 'workspace',
  studyManager: 'study-manager',
  analysisExecution: 'analysis-execution',
  expertFinder: 'expert-finder',
  dataCatalog: 'data-catalog',
  insightsLibrary: 'insights-library',
  adminSettings: 'admin-settings',
  cdmSourceList: 'cdm-source-list',
  externalResourceManager: 'external-resource-manager',
  submissions: 'submissions',
  auth: 'auth',
};

export {
  apiPaths,
  modulePaths,
};
