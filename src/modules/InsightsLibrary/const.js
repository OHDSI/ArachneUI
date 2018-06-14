/*
 *
 * Copyright 2018 Observational Health Data Sciences and Informatics
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
 * Created: July 17, 2017
 *
 */

import keyMirror from 'keymirror';
import { Utils } from 'services/Utils';

const paths = {
  insights: ({ insightId } = {}) => `/insights-library/insights${insightId ? `/${insightId}` : ''}`,
  insightFile: ({ insightId, fileUuid, query }) => Utils.setUrlParams(`/insights-library/insights/${insightId}/files${fileUuid ? `/${fileUuid}` : '' }`, query),
  studies: id => `/study-manager/studies/${id}`,
};

const apiPaths = {
  insights: ({ insightId } = {}) => `/api/v1/papers${insightId ? `/${insightId}` : ''}`,
  insightFiles: ({ insightId, fileUuid, query }) => Utils.setUrlParams(`/api/v1/papers/${insightId}/files${fileUuid ? `/${fileUuid}` : '' }`, query),
  insightFilesDownload: ({ insightId, fileUuid, query }) => Utils.setUrlParams(`/api/v1/papers/${insightId}/files/${fileUuid}/download`, query),
  insightUsers: ({ insightId, userId } = {}) => `/api/v1/papers/${insightId}/participants${userId ? `/${userId}` : '' }`,
  insightUserOptions: ({ insightId, query } = {}) => `/api/v1/user-management/users/suggest?target=PAPER&id=${insightId}&query=${query}`,
  setFavourite: insightId => `/api/v1/papers/${insightId}/favourite`,
};

const modals = keyMirror({
  insightFile: null,
  settings: null,
});

const forms = keyMirror({
  uploadInsightFile: null,
  attachInsightLink: null,
  listFilters: null,
});

const publishStateOptions = [
  {
    label: 'Published',
    value: 'PUBLISHED',
    tooltip: 'Visible to all',
    tooltipConf: 'left',
  },
  {
    label: 'Draft',
    value: 'DRAFT',
    tooltip: 'Visible to contributors only',
    tooltipConf: 'left',
  },
];

const insightRoleOptions = [
  {
    label: 'Lead',
    value: 'PAPER_LEAD',
  },
  {
    label: 'Contributor',
    value: 'PAPER_CONTRIBUTOR',
  },
];

const paperFileType = keyMirror({
  PROTOCOL: null,
  PAPER: null,
});

const publishStates = [
  {
    label: 'Published',
    value: 'PUBLISHED',
  },
  {
    label: 'Draft',
    value: 'DRAFT',
  },
];

export {
  apiPaths,
  forms,
  insightRoleOptions,
  modals,
  paths,
  paperFileType,
  publishStates,
  publishStateOptions,
};
