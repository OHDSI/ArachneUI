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
 * Created: May 05, 2017
 *
 */

import { createSelector } from 'reselect';
import get from 'lodash/get';
import { pageSize, paths } from 'modules/AnalysisExecution/const';
import fileConverter from 'components/FileInfo/converter';

const getSubmissionId = state =>
    get(state, 'analysisExecution.insight.data.result.submission.id');
const getSelectedFileUuid = state =>
    get(state, 'analysisExecution.insightFile.data.uuid');
const getRawCodeList = state =>
    get(state, 'analysisExecution.insight.data.result.codeFiles') || [];
const getCurrentCodePage = state =>
    parseInt(get(state, 'routing.locationBeforeTransitions.query.codePage', 1), 10);
const getRawResultFileList = state =>
    get(state, 'analysisExecution.insight.data.result.resultFiles') || [];
const getCurrentResultPage = state =>
    parseInt(get(state, 'routing.locationBeforeTransitions.query.resultPage', 1), 10);

const getCodeList = createSelector(
  [getSubmissionId, getSelectedFileUuid, getRawCodeList, getCurrentCodePage],
  (submissionId, selectedFileUuid, rawCodeList, page) => {
    const codeList = rawCodeList.map(code => ({
      ...fileConverter(
        code,
        () => paths.insightCodeFile({
          submissionId,
          fileId: code.uuid,
        })
      ),
      isSelected: selectedFileUuid === code.uuid,
      commentCount: code.commentCount,
    }
    ));
    return codeList.splice((page - 1) * pageSize.insightCode, pageSize.insightCode);
  }
);

const getCodePageCount = createSelector(
  [getRawCodeList],
  codeList => Math.ceil(codeList.length / pageSize.insightCode)
);

const getResultFileList = createSelector(
  [getSubmissionId, getSelectedFileUuid, getRawResultFileList, getCurrentResultPage],
  (submissionId, selectedFileUuid, rawResultFileList, page) => {
    const resultList = rawResultFileList.map(item => ({
      ...fileConverter(
        item,
        () => paths.insightResultFile({
          submissionId,
          fileId: item.uuid,
        })
      ),
      label: item.name,
      isSelected: selectedFileUuid === item.uuid,
      commentCount: item.commentCount,
    }
    ));
    return resultList.splice((page - 1) * pageSize.insightResult, pageSize.insightResult);
  }
);

const getResultPageCount = createSelector(
  [getRawResultFileList],
  resultList => Math.ceil(resultList.length / pageSize.insightResult)
);

export default {
  getCodeList,
  getCodePageCount,
  getCurrentCodePage,
  getResultFileList,
  getResultPageCount,
  getCurrentResultPage,
};
