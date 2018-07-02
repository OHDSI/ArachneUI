/*
 *
 * Copyright 2018 Observational Health Data Sciences and Informatics
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
import SubmissionGroupSelectors from 'modules/AnalysisExecution/components/SubmissionCodeViewer/GroupFile/selectors';
import actions from 'actions';
import { SubmissionGroupLinkBuilder } from 'modules/AnalysisExecution/ducks/linkBuilder';

class SubmissionGroupFile extends SubmissionCode {
  componentWillMount() {
    super.componentWillMount();
    this.LinkBuilder = new SubmissionGroupLinkBuilder({
      submissionId: this.props.params.submissionId,
      submissionGroupId: this.props.params.submissionGroupId,
      fileId: this.props.params.fileId,
      downloadFile: true,
    });
  }
}

export default class SubmissionGroupFileViewerBuilder extends SubmissionCodeBuilder {
  constructor() {
    super();
    this.selectors = new SubmissionGroupSelectors().build();
  }

  getComponent() {
    return SubmissionGroupFile;
  }

  getMapDispatchToProps() {
    return {
      ...super.getMapDispatchToProps(),
      loadFile: actions.analysisExecution.submissionGroupFile.find,
      clearFileData: actions.analysisExecution.submissionGroupFile.clear,
    };
  }
}
