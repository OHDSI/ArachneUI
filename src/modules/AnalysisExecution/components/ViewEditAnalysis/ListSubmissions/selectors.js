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
 * Created: December 13, 2016
 *
 */

import { createSelector } from 'reselect';
import sortBy from 'lodash/sortBy';
import keyBy from 'lodash/keyBy';
import moment from 'moment-timezone';
import { get } from 'services/Utils';
import { commonDate as commonDateFormat } from 'const/formats';
import { dsConverter } from 'components/LabelDataSource';

class SubmissionListSelectorsBuilder {

  getRawSubmissionGroupList(state) {
    return get(state, 'analysisExecution.analysis.data.result.submissionGroup', [], 'Array');
  }

  convertSubmission(source) {
    const actionsWPermissions = source.availableActionList
      .map(a => ({
        available: a.available,
        name: a.name,
        result: a.result,
        hasPermsission: source.permissions.APPROVE_SUBMISSION,
      }));

    const submission = {
      id: source.id,
      dataSource: dsConverter(source.dataSource),
      status: source.status || {},
      actions: keyBy(actionsWPermissions, 'name'),
      resultFilesCount: source.resultFilesCount,
      insight: source.insight,
      hasInsight: !!source.insight,
    };

    return submission;
  }

  getSubmissionList(rawSubmissionList) {
    return sortBy(
      rawSubmissionList.map(this.convertSubmission),
      s => s.dataSource.name
    );
  }

  getSubmissionGroupList(rawSgList) {
    return rawSgList.map(source => ({
      id: source.id,
      queryFilesCount: source.queryFilesCount,
      checksum: source.checksum,
      created: source.created ? moment(source.created).tz(moment.tz.guess()).format(commonDateFormat) : '',
      submissions: this.getSubmissionList(source.submissions),
    }));
  }

  buildSelectorForGetSubmissionGroupList() {
    return createSelector(
      this.getRawSubmissionGroupList,
      this.getSubmissionGroupList.bind(this)
    );
  }

  build() {
    return {
      getSubmissionGroupList: this.buildSelectorForGetSubmissionGroupList(),
    };
  }

}

export default SubmissionListSelectorsBuilder;
