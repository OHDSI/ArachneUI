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
 * Created: December 13, 2016
 *
 */

import { PropTypes } from 'react';
import { connect } from 'react-redux';
import { ModalUtils } from 'arachne-ui-components';
import { modal } from 'modules/AnalysisExecution/const';
import get from 'lodash/get';
import actions from 'actions';
import ListSubmissions from './presenter';
import SelectorsBuilder from './selectors';

const selectors = (new SelectorsBuilder()).build();

function mapStateToProps(state) {
  const analysisData = get(state, 'analysisExecution.analysis.data.result');
  return {
    analysisId: get(analysisData, 'id'),
    submissionGroupList: selectors.getSubmissionGroupList(state),
  };
}

const mapDispatchToProps = {
  showFileList: data => ModalUtils.actions.toggle(modal.analysisFiles, true, data),
  loadAnalysis: actions.analysisExecution.analysis.find,
  changeExecutionStatus: actions.analysisExecution.executionStatus.create,
  changePublishStatus: actions.analysisExecution.publishStatus.create,
  showStatusHistory: ({ submissionId }) =>
    ModalUtils.actions.toggle(modal.statusHistory, true, { submissionId }),
  showUploadForm: submissionId =>
    ModalUtils.actions.toggle(modal.uploadResult, true, { submissionId }),
  showCreateInsight: submissionId =>
    ModalUtils.actions.toggle(modal.createInsight, true, { submissionId }),
  showRejectionModal: (submissionId, type, analysisId) =>
    ModalUtils.actions.toggle(modal.rejectSubmission, true, { submissionId, type, analysisId }),
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    showCodeFileList({ id, queryFilesCount }) {
      dispatchProps.showFileList({
        type: 'code',
        submissionGroupId: id,
        canRemoveFiles: false,
        queryFilesCount,
      });
    },
    showResultFileList(submission) {
      dispatchProps.showFileList({
        type: 'result',
        submissionId: submission.id,
        canRemoveFiles: submission.canUploadResult,
        resultFilesCount: submission.resultFilesCount,
      });
    },
    onChangeExecutionStatus(submissionId, status) {
      dispatchProps.changeExecutionStatus({ submissionId }, { id: submissionId, isApproved: status })
        .then(() => dispatchProps.loadAnalysis({ id: stateProps.analysisId }))
        .catch(() => {});
    },
    onChangePublishStatus(submissionId, status) {
      dispatchProps.changePublishStatus({ submissionId }, { id: submissionId, isApproved: status })
        .then(() => dispatchProps.loadAnalysis({ id: stateProps.analysisId }))
        .catch(() => {});
    },
  };
}

ListSubmissions.propTypes = {
  analysisId: PropTypes.number,
  loadAnalysis: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ListSubmissions);
