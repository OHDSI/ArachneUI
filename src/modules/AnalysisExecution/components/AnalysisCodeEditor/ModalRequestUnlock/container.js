/**
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
 * Created: May 23, 2017
 *
 */

import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import get from 'lodash/get';

import actions from 'actions/index';
import { ModalUtils } from 'arachne-ui-components';
import { modal, form } from 'modules/AnalysisExecution/const';
import ModalRequestUnlock from './presenter';

function mapStateToProps(state) {
  const analysisData = get(state, 'analysisExecution.analysis.data.result');
  return {
    analysisId: get(analysisData, 'id'),
  };
}

const mapDispatchToProps = {
  loadAnalysis: actions.analysisExecution.analysis.find,
  requestUnlock: actions.analysisExecution.codeLock.create,
  closeModal: () => ModalUtils.actions.toggle(modal.requestUnlock, false),
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    doSubmit({ description }) {
      const submitPromise = dispatchProps.requestUnlock(
        { analysisId: stateProps.analysisId, requestUnlock: true },
        { description }
      );

      submitPromise
        .then(() => dispatchProps.closeModal())
        .then(() => dispatchProps.loadAnalysis({ id: stateProps.analysisId }))
        .catch(() => {});

      return submitPromise;
    },
  };
}

let ReduxModalRequestUnlock = ModalUtils.connect({
  name: modal.requestUnlock,
})(ModalRequestUnlock);

ReduxModalRequestUnlock = reduxForm({
  form: form.requestUnlock,
})(ReduxModalRequestUnlock);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxModalRequestUnlock);
