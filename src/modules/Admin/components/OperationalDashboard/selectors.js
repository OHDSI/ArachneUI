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
 * Created: September 27, 2021
 *
 */

import { createSelector } from 'reselect';
import { get } from 'services/Utils';

const getEngineStatus = state => get(state, 'adminSettings.engineStatus.queryResult.status') || 'OFFLINE';

const getOperationalDashboardGroups = createSelector(
  [getEngineStatus],
  (engineStatus) => {
    const status = engineStatus.toLowerCase();

    const fieldList = [{
      label: 'Engine status',
      name: String(0),
      value: status,
      type: 'label',
      disabled: true,
      indicator: engineStatus === 'ONLINE' ? 'GREEN' : 'RED',
    }];
    const initialValues = [status];

    return [{
      label: 'Operational Status',
      name: 'operationalStatus',
      fieldList,
      initialValues,
    }];
  }
);

export default {
  getOperationalDashboardGroups,
};
