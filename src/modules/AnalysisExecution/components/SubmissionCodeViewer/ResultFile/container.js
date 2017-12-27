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
 * Created: December 26, 2017
 *
 */

import { SubmissionCodeBuilder, SubmissionCode } from 'modules/AnalysisExecution/components/SubmissionCodeViewer/container';
import actions from 'actions';
import { get } from 'services/Utils';
import { SubmissionResultLinkBuilder } from 'modules/AnalysisExecution/ducks/linkBuilder';
import { push as goToPage } from 'react-router-redux';
import { paths } from 'modules/AnalysisExecution/const';
import mimeTypes from 'const/mimeTypes';
import SubmissionResultSelectors from './selectors';

class SubmissionResultFile extends SubmissionCode {
  componentWillMount() {
    super.componentWillMount();
    this.loadTree(this.props);
    this.LinkBuilder = new SubmissionResultLinkBuilder({
      submissionId: this.props.params.submissionId,
      fileId: this.props.params.fileUuid,
      downloadFile: true,
    });
  }
}

export default class SubmissionResultFileViewerBuilder extends SubmissionCodeBuilder {
  constructor() {
    super();
    this.selectors = new SubmissionResultSelectors().build();
  }

  getComponent() {
    return SubmissionResultFile;
  }

  mapStateToProps(state, ownProps) {
    return {
      ...super.mapStateToProps(state, ownProps),
      treeData: this.selectors.getFileTreeData(state),
      isTreeLoading: this.selectors.getIsTreeLoading(state),
    };
  }

  getMapDispatchToProps() {
    return {
      ...super.getMapDispatchToProps(),
      loadFile: actions.analysisExecution.submissionResultFile.find,
      clearFileData: actions.analysisExecution.submissionResultFile.clear,
      showSummary: ({ submissionId }) => goToPage(paths.submissionResultSummary({ submissionId })),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    // add a link to summary
    const treeData = {
      ...stateProps.treeData,
      children: [
        {
          docType: mimeTypes.other,
          isExpanded: false,
          onClick: () => dispatchProps.showSummary({ submissionId: stateProps.submissionId }),
          relativePath: '',
          label: 'Summary',
        },
        ...get(stateProps.treeData, 'children', []),
      ],
    };

    return {
      ...super.mergeProps(stateProps, dispatchProps, ownProps),
      treeData,
    };
  }
}
