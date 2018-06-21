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
 * Created: December 13, 2016
 *
 */

import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import get from 'lodash/get';

import actions from 'actions/index';
import { ModalUtils } from 'arachne-ui-components';
import { modal, form } from 'modules/AnalysisExecution/const';
import ModalEditTitle from './presenter';

function mapStateToProps(state) {
  const analysisData = get(state, 'analysisExecution.analysis.data.result');
  return {
    analysisId: get(analysisData, 'id'),
    typeId: get(analysisData, 'type.id'),
    initialValues: {
      title: get(analysisData, 'title'),
    },
  };
}

const mapDispatchToProps = {
  updateAnalysis: actions.analysisExecution.analysis.update,
  loadAnalysis: actions.analysisExecution.analysis.find,
  closeModal: () => ModalUtils.actions.toggle(modal.editAnalysisTitle, false),
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    doSubmit({ title }) {
      const submitPromise = dispatchProps.updateAnalysis(
        { id: stateProps.analysisId },
        { title, typeId: stateProps.typeId },
        false
      );

      submitPromise
        .then(() => dispatchProps.closeModal())
        .then(() => dispatchProps.loadAnalysis({ id: stateProps.analysisId }))
        .catch(() => {});

      // We have to return a submission promise back to redux-form
      // to allow it update the state
      return submitPromise;
    },
  });
}

let ReduxModalEditTitle = ModalUtils.connect({
  name: modal.editAnalysisTitle,
})(ModalEditTitle);

ReduxModalEditTitle = reduxForm({
  form: form.editAnalysisTitle,
  enableReinitialize: true,
})(ReduxModalEditTitle);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxModalEditTitle);
