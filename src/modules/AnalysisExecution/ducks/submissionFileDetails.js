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
 * Created: November 14, 2017
 *
 */

// drilldown for treemap reports
import { apiPaths } from 'modules/AnalysisExecution/const';
import Duck from 'services/Duck';

function linkBuilder({
  type,
  submissionGroupId,
  submissionId,
  fileId,
  downloadFile = false,
  query = { withContent: true },
}) {
  let link;

  if (type === 'query') {
    if (!submissionGroupId && submissionId) {
      link = apiPaths.submissionGroupCodeBySubmission({ submissionId, fileId, downloadFile, query });
    } else {
      link = apiPaths.submissionGroupCode({ submissionGroupId, fileId, downloadFile, query });
    }
  } else if (type === 'result') {
    link = apiPaths.submissionResults({ submissionId, fileId, downloadFile, query });
  }

  return link;
}

export const downloadLinkBuilder = linkBuilder;

const coreName = 'AE_ANALYSIS_SUBMISSION_FILE_DETAILS';

const duck = new Duck({
  name: coreName,
  urlBuilder: linkBuilder,
});

const clear = function () {
  return dispatch => dispatch({
    type: `${coreName}_FIND_FULFILLED`,
    payload: null,
  });
};

export default {
  actions: {
    ...duck.actions,
    clear,
  },
  reducer: duck.reducer,
};
