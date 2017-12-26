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
import { SubmissionResultLinkBuilder } from 'modules/AnalysisExecution/ducks/linkBuilder';
import SubmissionResultSelectors from './selectors';

class SubmissionResultFile extends SubmissionCode {
  componentWillMount() {
    this.props.loadFileList({ submissionId: this.props.submissionId });
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

  getMapDispatchToProps() {
    return {
      ...super.getMapDispatchToProps(),
      loadFile: actions.analysisExecution.submissionResultFile.find,
      clearFileData: actions.analysisExecution.submissionResultFile.clear,
      loadFileList: ({ submissionId, path = '/' }) =>
        actions.analysisExecution.analysisCode.codeList.query(
          {
            entityId: submissionId,
            isSubmissionGroup: false,
          },
          {
            path,
          }
        ),
    };
  }
}
