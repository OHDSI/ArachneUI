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
 * Created: March 14, 2017
 *
 */

import { connect } from 'react-redux';
import {
  reduxForm,
  reset as resetForm,
} from 'redux-form';
import get from 'lodash/get';

import actions from 'actions/index';
import { ModalUtils } from 'arachne-ui-components';
import { modal, form } from 'modules/AnalysisExecution/const';
import { buildFormData } from 'services/Utils';
import ModalUploadResult from './presenter';

function mapStateToProps(state) {
  const analysisData = get(state, 'analysisExecution.analysis.data.result');
  const modalData = state.modal.uploadResult;
  return {
    analysisId: get(analysisData, 'id'),
    submissionId: get(modalData, 'data.submissionId'),
  };
}

const mapDispatchToProps = {
  loadAnalysis: actions.analysisExecution.analysis.find,
  closeModal: () => ModalUtils.actions.toggle(modal.uploadResult, false),
  resetForm: resetForm.bind(null, form.uploadResult),
  uploadResultFile: actions.analysisExecution.resultFile.create,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    doSubmit({ result }) {
      const submitPromises = [];

      if (Array.isArray(result)) {
        // If a file selected
        result.map((file) => {
          submitPromises.push(dispatchProps.uploadResultFile(null,
            buildFormData({
              label: file.label,
              file,
              submissionId: stateProps.submissionId,
            })
          ));
        });
      }

      const submitPromise = Promise.all(submitPromises)
        .then(() => dispatchProps.resetForm())
        .then(() => dispatchProps.closeModal())
        .then(() => dispatchProps.loadAnalysis({ id: stateProps.analysisId }));

      // We have to return a submission promise back to redux-form
      // to allow it update the state
      return submitPromise;
    },
  });
}

let ReduxModalUploadResult = ModalUtils.connect({
  name: modal.uploadResult,
})(ModalUploadResult);

ReduxModalUploadResult = reduxForm({
  form: form.uploadResult,
})(ReduxModalUploadResult);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxModalUploadResult);
