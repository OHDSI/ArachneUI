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
 * Created: September 27, 2017
 *
 */

// import api from 'services/Api';
import { apiPaths } from 'modules/AnalysisExecution/const';
import Api from 'services/Api';
import Duck from 'services/Duck';

export const coreName = 'AE_ANALYSIS_CODE';

const duck = new Duck({
  name: coreName,
  urlBuilder: apiPaths.analysisCode,
});

const codeList = new Duck({
  name: `${coreName}`,
  urlBuilder: ({ entityId, isSubmissionGroup } = {}) => {
    const apiPath = isSubmissionGroup
      ? apiPaths.submissionGroupCodeFiles({ submissionGroupId: entityId })
      : apiPaths.submissionCodeFiles({ submissionId: entityId });

    return apiPath;
  },
});

function receiveAnalysisCodeFlush() {
  return {
    type: `${coreName}_QUERY_FULFILLED`,
    payload: null,
  };
}

function flush() {
  return dispatch => dispatch(receiveAnalysisCodeFlush());
}

function search(urlParams, requestParams) {
  return () => Api.doGet(
    apiPaths.submissionCodeFiles({ submissionId: urlParams.entityId }),
    requestParams
  );
}

export default {
  actions: {
    ...duck.actions,
    codeList: codeList.actions,
    flush,
    search,
  },
  reducer: duck.reducer,
};
