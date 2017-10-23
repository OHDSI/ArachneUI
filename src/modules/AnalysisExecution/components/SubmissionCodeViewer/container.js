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
 * Created: June 13, 2017
 *
 */

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { get, detectLanguageByExtension } from 'services/Utils';
import actions from 'actions/index';
import { downloadLinkBuilder } from 'modules/AnalysisExecution/ducks/submissionFile';
import { buildBreadcrumbList } from 'modules/AnalysisExecution/utils';
import presenter from './presenter';

class SubmissionCode extends Component {

  componentWillMount() {
    this.props.loadBreadcrumbs({
      entityType: this.props.from,
      id: this.props.submissionGroupId || this.props.submissionId,
    });
  }

  render() {
    return presenter(this.props);
  }
}

SubmissionCode.propTypes = {
  loadSubmissionFile: PropTypes.func,
  submissionGroupId: PropTypes.number,
  submissionId: PropTypes.string,
  from: PropTypes.string,
  loadBreadcrumbs: PropTypes.func,
  fileUuid: PropTypes.string,
  type: PropTypes.string,
};

function mapStateToProps(state, ownProps) {
  const from = ownProps.route.from;
  const type = ownProps.route.type;

  const submissionGroupId = ownProps.params.submissionGroupId;
  const submissionId = ownProps.params.submissionId;
  const fileUuid = ownProps.params.fileUuid;

  const isFileLoading = get(state, 'analysisExecution.submissionFile.isLoading', false);
  const isLoading = get(state, 'analysisExecution.breadcrumbs.isLoading', false)
    || isFileLoading;

  const pageTitle = [
    get(state, 'analysisExecution.submissionFile.data.result.name', 'Code file'),
    ...(get(state, 'analysisExecution.breadcrumbs.data', []).map(crumb => crumb.title).reverse()),
    'Arachne',
  ];

  const downloadLink = downloadLinkBuilder({ type, submissionGroupId, submissionId, fileId: fileUuid, downloadFile: true });

  const submissionFileData = get(state, 'analysisExecution.submissionFile.data.result');

  const urlParams = {
    type,
    submissionGroupId,
    submissionId,
    fileId: fileUuid,
  };

  const breadcrumbList = buildBreadcrumbList(get(state, 'analysisExecution.breadcrumbs.queryResult.result'));
  const backUrl = breadcrumbList.length > 0 ? breadcrumbList[breadcrumbList.length - 1].link : null;

  const toolbarOpts = {
    backUrl,
    breadcrumbList,
    title: get(submissionFileData, 'label') || get(submissionFileData, 'name'),
  };

  return {
    urlParams,
    file: submissionFileData,
    isLoading,
    toolbarOpts,
    pageTitle: pageTitle.join(' | '),
    downloadLink,
    from,
    submissionGroupId,
    submissionId,
  };
}

const mapDispatchToProps = {
  loadBreadcrumbs: actions.analysisExecution.breadcrumbs.query,
  loadFile: actions.analysisExecution.submissionFile.find,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubmissionCode);
