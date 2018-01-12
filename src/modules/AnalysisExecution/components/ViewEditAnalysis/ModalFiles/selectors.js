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
 * Created: May 17, 2017
 *
 */

import { createSelector } from 'reselect';
import { get } from 'services/Utils';
import fileConverter from 'components/FileInfo/converter';
import { paths } from 'modules/AnalysisExecution/const';

const getSubmissionId = state =>
    get(state, 'modal.analysisFiles.data.submissionId');
const getSubmissionGroupId = state =>
    get(state, 'modal.analysisFiles.data.submissionGroupId');
const getRawFiles = state => get(state, 'analysisExecution.analysisCode.queryResult', [], 'Array');

const getResultFiles = createSelector(
  [getRawFiles, getSubmissionId],
  (files, submissionId) => files.map((file) => {
    return fileConverter(
      file,
      codeFile => paths.submissionResultFile({
        submissionId,
        fileId: codeFile.fileId,
      })
    );
  })
);

const getQueryFiles = createSelector(
  [getRawFiles, getSubmissionGroupId],
  (files, submissionGroupId) => files.map((file) => {
    return fileConverter(
      file,
      codeFile => paths.submissionCodeFile({
        submissionGroupId,
        fileId: codeFile.fileId,
      })
    );
  })
);

export default {
  getResultFiles,
  getQueryFiles,
};
