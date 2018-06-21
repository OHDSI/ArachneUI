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
 * Created: May 05, 2017
 *
 */

import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { get } from 'services/Utils';

import actions from 'actions/index';
import { ModalUtils } from 'arachne-ui-components';
import { modal, form } from 'modules/AnalysisExecution/const';
import ModalEditTitle from './presenter';

function mapStateToProps(state) {
  const insightData = get(state, 'analysisExecution.insight.data.result');

  return {
    initialValues: {
      name: get(insightData, 'name'),
    },
  };
}

const mapDispatchToProps = {
  closeModal: () => ModalUtils.actions.toggle(modal.editInsightTitle, false),
  loadInsight: actions.analysisExecution.insight.find,
  updateInsight: actions.analysisExecution.insight.update,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    doSubmit({ name }) {
      const submitPromise = dispatchProps.updateInsight(
        { submissionId: ownProps.submissionId },
        { name }
      );

      submitPromise
        .then(() => dispatchProps.closeModal())
        .then(() => dispatchProps.loadInsight({ submissionId: ownProps.submissionId }))
        .catch(() => {});

      return submitPromise;
    },
  });
}

let ReduxModalEditTitle = ModalUtils.connect({
  name: modal.editInsightTitle,
})(ModalEditTitle);

ReduxModalEditTitle = reduxForm({
  form: form.editInsightTitle,
  enableReinitialize: true,
})(ReduxModalEditTitle);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxModalEditTitle);
