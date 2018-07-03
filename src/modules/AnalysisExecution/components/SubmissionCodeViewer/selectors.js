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
 * Created: November 14, 2017
 *
 */

import { createSelector } from 'reselect';
import converter from 'components/FileInfo/converter';
import { get } from 'services/Utils';
import find from 'lodash/find';
import { paths, breadcrumbTypes } from 'modules/AnalysisExecution/const';

export class SubmissionCodeSelectorsBuilder {

  getRawFiles(state) {
    return get(state, 'analysisExecution.analysisCode.queryResult', [], 'Array');
  }

  getPermissions(state) {
    return get(state, 'analysisExecution.submissionSummary.submission.data.permissions', {}, 'Object');
  }

  buildSelectorForSubmissionFileList() {
    return createSelector(
      [this.getRawFiles],
      files => files.map(
        file => converter(file, item => paths.submissionResultFile({ submissionId: item.submissionId, fileId: item.fileId }))
      )
    );
  }

  getBreadcrumbs(state) {
    return get(state, 'analysisExecution.breadcrumbs.queryResult.result', [], 'Array');
  }

  buildSelectorForAnalysis() {
    return createSelector(
      this.getBreadcrumbs,
      breadcrumbs => find(breadcrumbs, ['entityType', breadcrumbTypes.ANALYSIS])
    );
  }

  getIsFileLoading(state) {
    return false;
  }

  getPageTitle(state) {
    return 'Code file';
  }

  getFileData(state) {
    return null;
  }

  getFileTreeData(state) {
    return get(state, 'analysisExecution.fileTreeData.queryResult');
  }

  getSelectedFileFromTree(state) {
    return get(state, 'analysisExecution.fileTreeData.selectedFile');
  }

  getIsTreeLoading(state) {
    return get(state, 'analysisExecution.fileTreeData.isLoading', false);
  }

  build() {
    return {
      getSubmissionFilesList: this.buildSelectorForSubmissionFileList(),
      getAnalysis: this.buildSelectorForAnalysis(),
      getIsFileLoading: this.getIsFileLoading,
      getFileData: this.getFileData,
      getPageTitle: this.getPageTitle,
      
      getFileTreeData: this.getFileTreeData,
      getSelectedFileFromTree: this.getSelectedFileFromTree,
      getIsTreeLoading: this.getIsTreeLoading,
      getPermissions: this.getPermissions,
    };
  }
}
