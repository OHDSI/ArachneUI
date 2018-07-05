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
 * Created: June 04, 2017
 *
 */

import { createSelector } from 'reselect';
import get from 'lodash/get';
import moment from 'moment-timezone';
import { commonDate as commonDateFormat } from 'const/formats';
import { dsConverter } from 'components/LabelDataSource';
import { paths } from 'modules/AnalysisExecution/const';

const getRawDataSource = state => get(state, 'analysisExecution.insight.data.result.dataSource');
const getRawCreatedAt = state => get(state, 'analysisExecution.insight.data.result.submission.createdAt', '');
const getRawSubmissionAuthor = state => get(state, 'analysisExecution.insight.data.result.submission.author', {});

const getDataSource = createSelector(
  [getRawDataSource],
  dataSource => dataSource ? dsConverter(dataSource) : {} // eslint-disable-line no-confusing-arrow
);

const getSubmissionCreatedAt = createSelector(
  [getRawCreatedAt],
  createdAt => createdAt // eslint-disable-line no-confusing-arrow
      ? moment(createdAt).tz(moment.tz.guess()).format(commonDateFormat)
      : ''
);

const getSubmissionAuthor = createSelector(
  [getRawSubmissionAuthor],
  ({ id, firstname, lastname }) => ({
    name: `${firstname} ${lastname}`,
    link: paths.profile(id),
  })
);

export default {
  getDataSource,
  getSubmissionAuthor,
  getSubmissionCreatedAt,
};
