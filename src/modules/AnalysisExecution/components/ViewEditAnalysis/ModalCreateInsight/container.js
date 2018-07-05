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
 * Created: May 05, 2017
 *
 */

import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import get from 'lodash/get';

import actions from 'actions/index';
import { ModalUtils } from 'arachne-ui-components';
import { modal, form, paths } from 'modules/AnalysisExecution/const';
import { push as goToPage } from 'react-router-redux';
import ModalCreateInsight from './presenter';

function mapStateToProps(state) {
  const analysisData = get(state, 'analysisExecution.analysis.data.result');
  return {
    analysisId: get(analysisData, 'id'),
    submissionId: get(state, `modal.${modal.createInsight}.data.submissionId`),
  };
}

const mapDispatchToProps = {
  createInsight: actions.analysisExecution.insight.create,
  showInsight: submissionId => goToPage(paths.insight({ submissionId })),
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    doSubmit({ name }) {
      const submitPromise = dispatchProps.createInsight(
        { submissionId: stateProps.submissionId },
        { name }
      );

      submitPromise
        .then(() => dispatchProps.showInsight(stateProps.submissionId))
        .catch(() => {});

      return submitPromise;
    },
  };
}

let ReduxModalCreateInsight = ModalUtils.connect({
  name: modal.createInsight,
})(ModalCreateInsight);

ReduxModalCreateInsight = reduxForm({
  form: form.createInsight,
  enableReinitialize: true,
})(ReduxModalCreateInsight);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxModalCreateInsight);
