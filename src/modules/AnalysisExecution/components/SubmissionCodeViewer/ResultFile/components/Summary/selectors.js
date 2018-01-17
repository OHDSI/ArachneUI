/*
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
 * Created: December 20, 2017
 *
 */

import { createSelector } from 'reselect';
import { get } from 'services/Utils';
import find from 'lodash/find';
import flatten from 'lodash/flatten';
import { breadcrumbTypes } from 'modules/AnalysisExecution/const';

class SubmissionResultSummarySelectorsBuilder {
  getBreadcrumbs(state) {
    return get(state, 'analysisExecution.breadcrumbs.queryResult.result', [], 'Array');
  }

  getAnalysis(state) {
    return get(state, 'analysisExecution.submissionSummary.analysis.data');
  }

  buildSelectorForAnalysisId() {
    return createSelector(
      this.getBreadcrumbs,
      (breadcrumbs) => {
        const crumb = find(breadcrumbs, ['entityType', breadcrumbTypes.ANALYSIS]);
        if (crumb) {
          return get(crumb, 'id', -1);
        }

        return -1;
      }
    );
  }

  getSubmission(state) {
    return get(state, 'analysisExecution.submissionSummary.submission.data', {}, 'Object');
  }

  buildSelectorForSubmissionType() {
    return createSelector(
      [this.getSubmission],
      submission => get(submission, 'analysisType')
    );
  }

  build() {
    return {
      getAnalysisId: this.buildSelectorForAnalysisId(),
      getAnalysis: this.getAnalysis,
      getSubmissionType: this.buildSelectorForSubmissionType(),
      getSubmission: this.getSubmission,
    };
  }

}

export default SubmissionResultSummarySelectorsBuilder;
