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
import { modal, form, submissionActionTypes } from 'modules/AnalysisExecution/const';
import ModalRejectSubmission from './presenter';

function mapStateToProps(state) {
  return {
    submissionId: get(state, `modal.${modal.rejectSubmission}.data.submissionId`),
    analysisId: get(state, `modal.${modal.rejectSubmission}.data.analysisId`),
    type: get(state, `modal.${modal.rejectSubmission}.data.type`),
  };
}

const mapDispatchToProps = {
  closeModal: () => ModalUtils.actions.toggle(modal.rejectSubmission, false),
  resetForm: () => resetForm(form.rejectSubmission),
  changeExecutionStatus: actions.analysisExecution.executionStatus.create,
  changePublishStatus: actions.analysisExecution.publishStatus.create,
  loadAnalysis: actions.analysisExecution.analysis.find,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    doSubmit({ comment }) {
      let submitPromise;
      switch (stateProps.type) {
        case submissionActionTypes.EXECUTE:
          submitPromise = dispatchProps.changeExecutionStatus(
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
          submitPromise = dispatchProps.changePublishStatus(
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

      submitPromise
        .then(() => dispatchProps.closeModal())
        .then(() => dispatchProps.resetForm())
        .then(() => dispatchProps.loadAnalysis({ id: stateProps.analysisId }, true))
        .catch(() => {});

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
