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
	addPermission: null,
	editPermission: null,
	licenseFilter: null,
    downloadsFilter:null,
});

const modal = keyMirror({
	addPermission: null,
	editPermission: null,
});

const actionTypes = keyMirror({
    STATISTICS_SORT_ORDER_UPDATED: null,
});

const paths = {
	licenses: (pendingOnly: boolean) => `/admin/licenses${pendingOnly ? '/pending' : ''}`,
    statistics: '/admin/statistics'
};

const apiPaths = {
    statisticsCsv: (query: string) => `/api/v1/statistics/csv${query}`,
};

const pageSize = 12;

export {
  actionTypes,
  apiPaths,
  forms,
  modal,
  paths,
  pageSize,
};
