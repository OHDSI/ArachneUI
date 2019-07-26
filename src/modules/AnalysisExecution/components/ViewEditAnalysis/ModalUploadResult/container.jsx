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
 * Created: March 14, 2017
 *
 */

import { connect } from 'react-redux';
import {
  reduxForm,
  reset as resetForm,
} from 'redux-form';
import { get, buildFormData } from 'services/Utils';

import actions from 'actions/index';
import { ModalUtils } from 'arachne-ui-components';
import { modal, form, submissionGroupsPageSize } from 'modules/AnalysisExecution/const';
import ModalUploadResult from './presenter';
import { getFilter } from 'modules/AnalysisExecution/components/ViewEditAnalysis/container';
import { SECTIONS } from './const';

function mapStateToProps(state) {
  const analysisData = get(state, 'analysisExecution.analysis.data.result');
  const modalData = state.modal.uploadResult;
  const currentQuery = state.routing.locationBeforeTransitions.query;
  const filter = getFilter(state.routing.locationBeforeTransitions.search);

  return {
    analysisId: get(analysisData, 'id'),
    submissionId: get(modalData, 'data.submissionId'),
    page: get(currentQuery, 'page', 1),
    filter,
  };
}

const mapDispatchToProps = {
  loadAnalysis: actions.analysisExecution.analysis.find,
  loadSubmissionGroups: ({ page = 1, analysisId, filter }) => {
    const pageSize = submissionGroupsPageSize;
    return actions.analysisExecution.submissionGroups.query({ page, pageSize, analysisId, filter });
  },
  closeModal: () => ModalUtils.actions.toggle(modal.uploadResult, false),
  resetForm: resetForm.bind(null, form.uploadResult),
  uploadResultFile: actions.analysisExecution.resultFile.create,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    async doSubmit({ result }, type) {
      const submitPromises = [];
      const isArchive = type === SECTIONS.ARCHIVE;
      if (Array.isArray(result)) {
        // If a file selected
        result.map((file) => {
          submitPromises.push(dispatchProps.uploadResultFile(null,
            buildFormData({
              label: file.label,
              file,
              submissionId: stateProps.submissionId,
              archive: isArchive,
            })
          ));
        });
      }

      const submitPromise = await Promise.all(submitPromises);
      try {
        dispatchProps.resetForm();
        dispatchProps.closeModal();
        await dispatchProps.loadAnalysis({ id: stateProps.analysisId });
        dispatchProps.loadSubmissionGroups({
          analysisId: stateProps.analysisId,
          page: stateProps.page,
          filter: stateProps.filter,
        });
        if (ownProps.onUpload) {
          ownProps.onUpload();
        }
      } catch (er) {
        console.error(er);
      }

      // We have to return a submission promise back to redux-form
      // to allow it update the state
      return submitPromise;
    },
  };
}

let ReduxModalUploadResult = ModalUtils.connect({
  name: modal.uploadResult,
})(ModalUploadResult);

ReduxModalUploadResult = reduxForm({
  form: form.uploadResult,
})(ReduxModalUploadResult);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxModalUploadResult);
