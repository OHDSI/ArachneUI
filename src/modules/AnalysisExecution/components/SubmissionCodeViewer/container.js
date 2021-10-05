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
 * Created: June 13, 2017
 *
 */

import { PropTypes } from 'react';
import { get, isViewable } from 'services/Utils';
import actions from 'actions/index';
import { buildBreadcrumbList } from 'modules/AnalysisExecution/utils';
import ReportUtils from 'components/Reports/Utils';
import { reports } from 'const/reports';
import { LinkBuilder } from 'modules/AnalysisExecution/ducks/linkBuilder';
import FileTreeUtils from 'services/FileTreeUtils';
import { FileLoader } from 'services/FileLoader';
import presenter from './presenter';
import { ActiveModuleAwareContainerBuilder } from 'modules/StudyManager/utils'
import { domains } from 'modules/Portal/const';

export class SubmissionCode extends FileLoader {
  constructor() {
    super();
    this.LinkBuilder = new LinkBuilder();
  }

  componentWillMount() {
    if (this.props.urlParams.fileId) {
      super.componentWillMount();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.fileId !== nextProps.params.fileId) {
      this.loadData(nextProps);
    }
    if (!this.props.submission.id && nextProps.submission.id) {
      if (nextProps.canView) {
        this.props.loadBreadcrumbs({
          entityType: this.props.from,
          id: this.props.submissionGroupId || this.props.submissionId,
        });
      }
    }
  }

  componentWillUnmount() {
    this.props.flushFileTree();
    this.props.clearFileData();
    this.props.clearDetailsData();
  }

  getRenderParams() {
    return {
      ...this.props,
      downloadLink: this.LinkBuilder.build(),
    };
  }

  render() {
    return presenter(this.getRenderParams());
  }
}

export class SubmissionCodeBuilder extends ActiveModuleAwareContainerBuilder {
  constructor() {
    super();
    this.selectors = {};
  }

  getComponent() {
    return SubmissionCode;
  }

  mapStateToProps(state, ownProps) {
    const from = ownProps.route.from;
    const type = ownProps.route.type;
    const submissionGroupId = ownProps.params.submissionGroupId;
    const submissionId = ownProps.params.submissionId;
    const fileId = ownProps.params.fileId;

    const isFileLoading = this.selectors.getIsFileLoading(state);
    const isLoading = get(state, 'analysisExecution.breadcrumbs.isLoading', false)
      || isFileLoading;

    const pageTitle = [
      this.selectors.getPageTitle(state),
      ...(get(state, 'analysisExecution.breadcrumbs.data', []).map(crumb => crumb.title).reverse()),
      'Arachne',
    ];

    const submissionFileData = this.selectors.getFileData(state);

    const urlParams = {
      type,
      submissionGroupId,
      submissionId,
      fileId: fileId,
    };
    const isWorkspace = get(state, 'modules.active') === 'workspace';

    const breadcrumbList = buildBreadcrumbList(get(state, 'analysisExecution.breadcrumbs.queryResult.result'), isWorkspace);
    const backUrl = breadcrumbList.length > 0 ? breadcrumbList[breadcrumbList.length - 1].link : null;
    const analysis = this.selectors.getAnalysis(state);

    const toolbarOpts = {
      backUrl,
      breadcrumbList,
      caption: get(analysis, 'title'),
    };

    let isReport = false;
    if (submissionFileData && submissionFileData.content) {
      const reportType = ReportUtils.getReportType(get(submissionFileData, 'docType'));
      isReport = reportType !== reports.unknown;
    }
    const submission = this.selectors.getSubmission(state);
    const canView = isViewable(submission);

    return {
      urlParams,
      file: submissionFileData,
      isLoading,
      toolbarOpts,
      pageTitle: pageTitle.join(' | '),
      from,
      submissionGroupId,
      submissionId,
      submission,
      isReport,
      canView,
      selectedFilePath: this.selectors.getSelectedFileFromTree(state),
      permissions: {
        upload: false,
        remove: false,
      },
    };
  }

  getMapDispatchToProps() {
    return {
      loadBreadcrumbs: actions.analysisExecution.breadcrumbs.query,
      clearDetailsData: actions.analysisExecution.submissionFileDetails.clear,
    };
  }
  
  getId({ params }) {
    return params.submissionId;
  }
  
  getType({ params }) {
    return domains.SUBMISSION;
  }
}

SubmissionCode.propTypes = {
  loadSubmissionFile: PropTypes.func,
  submissionGroupId: PropTypes.number,
  submissionId: PropTypes.string,
  from: PropTypes.string,
  loadBreadcrumbs: PropTypes.func,
  fileId: PropTypes.number,
  type: PropTypes.string,
};
