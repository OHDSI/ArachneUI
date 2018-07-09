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
 * Created: February 14, 2017
 *
 */

import { createSelector } from 'reselect';
import get from 'lodash/get';
import moment from 'moment-timezone';
import { commonDate as commonDateFormat } from 'const/formats';
import { submissionStatusesTitles } from 'modules/AnalysisExecution/const';

const getRawStatusList = state => get(state, 'analysisExecution.statusHistory.queryResult.result') || [];

const getStatusList = createSelector(
  [getRawStatusList],
  (statuses) => {
    let finishedStatusIndex = -1;
    let approvedStatus = {
      value: 'APPROVED',
      title: 'Approved',
      comment: null,
    };
    const statusList = statuses.map((status, index) => {
      const statusMeta = {
        author: get(status, 'author') || {
          id: null,
          firstname: 'System',
        },
        date: moment(status.date).tz(moment.tz.guess()).format(commonDateFormat),
        title: submissionStatusesTitles[status.value],
      };
      if (status.value === 'EXECUTED_PUBLISHED') {
        finishedStatusIndex = index;
        approvedStatus = {
          ...statusMeta,
          ...approvedStatus,
        };
      }

      return {
        ...status,
        ...statusMeta,
      };
    });

    if (finishedStatusIndex !== -1) {
      statusList.splice(finishedStatusIndex, 0, approvedStatus);
    }

    return statusList;
  }
);

export default {
  getStatusList,
};
