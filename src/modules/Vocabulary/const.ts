/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexandr Saltykov, Pavel Grafkin, Vitaly Koulakov, Anton Gackovka
 * Created: March 3, 2017
 *
 */

import keyMirror = require('keymirror');

const forms = keyMirror({
  download: null,
  share: null,
	toolbar: null,
  downloadSettings: null,
  bundle: null,
  notifications: null,
});

const modal = keyMirror({
  download: null,
  share: null,
  downloadResult: null,
  requestLicense: null,
  confirmLicense: null,
  notifications: null,
  licenses: null,
});

const actionTypes = keyMirror({
  ALL_VOCABS_TOGGLED: null,
});

const paths = {
  vocabsList: () => '/vocabulary/list',
  history: () => '/vocabulary/download-history',
};

const apiPaths = {
  availability: id => `/vocabularies/check/${id}`,
  share: id => `/vocabularies/downloads/${id}/share`,
};

const resultsPageSize = 15;

const cdmVersions = [
  {
    label: 'CDM VERSION',
    value: '',
  },
	{
    label: '4.5',
    value: '4.5',
  },
	{
    label: '5.1.0',
    value: '5',
  },
];

const bundleStatuses: { [key: string]: string } = keyMirror({
  PENDING: null,
  READY: null,
  FAILED: null,
  ARCHIVED: null,
});

export {
  actionTypes,
  apiPaths,
  cdmVersions,
  forms,
  modal,
  paths,
  resultsPageSize,
  bundleStatuses,
};
