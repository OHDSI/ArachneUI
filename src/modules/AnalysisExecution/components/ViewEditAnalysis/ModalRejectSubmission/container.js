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
 * Created: July 19, 2017
 *
 */

import { connect } from 'react-redux';
import { reduxForm, reset as resetForm } from 'redux-form';
import get from 'lodash/get';

import actions from 'actions/index';
import { ModalUtils } from 'arachne-ui-components';
import { modal, form, submissionActionTypes, paths, submissionFilters, submissionStatuses, submissionGroupsPageSize } from 'modules/AnalysisExecution/const';
import ModalRejectSubmission from './presenter';
import SelectorsBuilder from 'modules/AnalysisExecution/components/ViewEditAnalysis/ListSubmissions/selectors';
import { getFilter } from 'modules/AnalysisExecution/components/ViewEditAnalysis/container';

const selectors = (new SelectorsBuilder()).build();

function mapStateToProps(state) {
  const search = get(state, 'routing.locationBeforeTransitions.search');
  const { number, totalPages } = selectors.getPagingData(state);
  return {
    submissionId: get(state, `modal.${modal.rejectSubmission}.data.submissionId`),
    analysisId: get(state, `modal.${modal.rejectSubmission}.data.analysisId`),
    type: get(state, `modal.${modal.rejectSubmission}.data.type`),
    page: number + 1,
    filter: getFilter(search),
  };
}

const mapDispatchToProps = {
  closeModal: () => ModalUtils.actions.toggle(modal.rejectSubmission, false),
  resetForm: () => resetForm(form.rejectSubmission),
  changeExecutionStatus: actions.analysisExecution.executionStatus.create,
  changePublishStatus: actions.analysisExecution.publishStatus.create,
  loadAnalysis: actions.analysisExecution.analysis.find,
  loadSubmissionGroups: ({ page = 1, analysisId, filter }) => {
    const pageSize = submissionGroupsPageSize;
    return actions.analysisExecution.submissionGroups.query({ page, pageSize, analysisId, filter });
  },
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    async doSubmit({ comment }) {
      let submitPromise;
      try {
        switch (stateProps.type) {
          case submissionActionTypes.EXECUTE:
            submitPromise = await dispatchProps.changeExecutionStatus(
              {
                submissionId: stateProps.submissionId,
              },
              {
                id: stateProps.submissionId,
                isApproved: false,
                comment,
              });
            break;
          case submissionActionTypes.PUBLISH:
            submitPromise = await dispatchProps.changePublishStatus(
              {
                submissionId: stateProps.submissionId,
              },
              {
                id: stateProps.submissionId,
                isApproved: false,
                comment,
              });
            break;
        }
        dispatchProps.loadSubmissionGroups({
          analysisId: stateProps.analysisId,
          page: stateProps.page,
          filter: stateProps.filter,
        });
        dispatchProps.closeModal();
        dispatchProps.resetForm();
        dispatchProps.loadAnalysis({ id: stateProps.analysisId }, true);
      } catch (er) {
      }
      return submitPromise;
    },
  };
}

let ReduxModalRejectSubmission = ModalUtils.connect({
  name: modal.rejectSubmission,
})(ModalRejectSubmission);

ReduxModalRejectSubmission = reduxForm({
  form: form.rejectSubmission,
  enableReinitialize: true,
})(ReduxModalRejectSubmission);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxModalRejectSubmission);
