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

import { createSelector } from 'reselect';
import { get } from 'services/Utils';
import { healthStatuses } from 'const/dataSource';

const getRawStudySourceList = state => get(state, 'analysisExecution.studyDataSourceList.queryResult.result') || [];
const getLastSubmissionGroup = state => get(state, 'analysisExecution.submissionGroups.queryResult.content[0]');

const getDataSourceOptions = createSelector(
  [getRawStudySourceList],
  rawList => rawList.map(dataSource => ({
    value: dataSource.id,
    label: `${get(dataSource, 'dataNode.name', '')}: ${dataSource.name}`,
    healthStatus: {
      title: healthStatuses.getTitle(dataSource.healthStatus),
      value: healthStatuses.getColor(dataSource.healthStatus)
    },
  }))
);

const getLastSources = createSelector(
  [getLastSubmissionGroup, getDataSourceOptions],
  (lastSubmissionGroup, dsOptions) => {
    if (lastSubmissionGroup) {
      const dataSources = [];
      lastSubmissionGroup.submissions.filter(s => dsOptions.find(o => o.id === s.dataSource.id)).forEach((submission) => {
        dataSources[submission.dataSource.id] = true;
      });

      return { dataSources };
    }
  }
);

export default {
  getDataSourceOptions,
  getLastSources,
};
