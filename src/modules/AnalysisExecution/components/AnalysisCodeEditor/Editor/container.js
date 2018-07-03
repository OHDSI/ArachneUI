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
 * Created: December 22, 2016
 *
 */

import { connect } from 'react-redux';
import { reduxForm, reset as resetForm } from 'redux-form';
import { push as goToPage } from 'react-router-redux';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import actions from 'actions/index';
import { ModalUtils } from 'arachne-ui-components';
import { apiPaths, form, paths, modal } from 'modules/AnalysisExecution/const';
import Editor from './presenter';
import selectors from './selectors';

function mapStateToProps(state) {
  const analysisData = get(state, 'analysisExecution.analysis.data.result');
  const analysisCodeData = get(state, 'analysisExecution.analysisCode.data.result');
  const initialEditorContent = get(analysisCodeData, 'content');
  const currentEditorContent = get(state, 'form.editCode.values.content');
  const isCodeChanged = !isEqual(initialEditorContent, currentEditorContent);
  const analysisId = get(analysisCodeData, 'analysisId');

  return {
    id: get(analysisCodeData, 'uuid'),
    analysisId,
    title: get(analysisCodeData, 'label', ''),
    downloadLink: apiPaths.analysisCodeDownload({
      analysisId,
      analysisCodeId: get(analysisCodeData, 'uuid'),
    }),
    initialValues: {
      content: initialEditorContent,
    },
    isCodeChanged,

    canLockCode: get(analysisData, 'permissions.LOCK_ANALYSIS_FILE'),
    isCodeLocked: get(analysisData, 'locked'),

    // Code metadata
    createdAt: get(analysisCodeData, 'created'),
    author: selectors.getAuthor(state),
    updatedAt: get(analysisCodeData, 'updated'),
    updatedBy: selectors.getUpdatedBy(state),
    version: get(analysisCodeData, 'version'),
  };
}

const mapDispatchToProps = {
  loadAnalysisCode: actions.analysisExecution.analysisCode.find,
  updateAnalysisCode: actions.analysisExecution.analysisCode.update,
  resetForm: () => resetForm(form.editCode),
  goToAnalysis: id => goToPage.call(null, paths.analyses(id)),
  showConfirmDialog: analysisId =>
    ModalUtils.actions.toggle(modal.confirmDialog, true, { analysisId }),
  loadAnalysis: actions.analysisExecution.analysis.find,
  lockCode: actions.analysisExecution.codeLock.create,
  openRequestUnlockModal: () => ModalUtils.actions.toggle(modal.requestUnlock, true),
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    doSubmit(data) {
      const submitPromise = dispatchProps.updateAnalysisCode(
        {
          analysisId: stateProps.analysisId,
          analysisCodeId: stateProps.id,
        },
        data,
      );

      submitPromise
        .then(() => dispatchProps.loadAnalysisCode({
          analysisId: stateProps.analysisId,
          analysisCodeId: stateProps.id,
        }))
        .catch(() => {});

      // We have to return a submission promise back to redux-form
      // to allow it update the state
      return submitPromise;
    },
    revertAnalysisCode() {
      if (stateProps.isCodeChanged) {
        dispatchProps.showConfirmDialog(stateProps.analysisId);
      } else {
        dispatchProps.goToAnalysis(stateProps.analysisId);
      }
    },
    unlockCode: () => {
      if (stateProps.canLockCode) {
        dispatchProps
          .lockCode(
            { analysisId: stateProps.analysisId },
            { locked: false }
          )
          .then(() => dispatchProps.loadAnalysis({ id: stateProps.analysisId }));
      } else {
        dispatchProps.openRequestUnlockModal();
      }
    },
  });
}

const ReduxEditor = reduxForm({
  form: form.editCode,
  enableReinitialize: true,
})(Editor);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxEditor);
