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
 * Created: January 16, 2017
 *
 */

import actions from 'actions';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { reduxForm, reset as resetForm } from 'redux-form';
import { forms } from 'modules/ExpertFinder/const';
import SummaryEdit from './presenter';

function mapStateToProps(state) {
  const moduleState = state.expertFinder.userProfile;
  const id = get(moduleState, 'data.result.id', '');
  const text = get(moduleState, 'data.result.general.personalSummary');

  return {
    initialValues: {
      text,
    },
    id,
  };
}

const mapDispatchToProps = {
  updateGeneralInfo: actions.expertFinder.userProfile.generalInfo.update,
  resetForm: () => resetForm(forms.summary),
  loadInfo: actions.expertFinder.userProfile.find,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    cancel: () => ownProps.setViewMode(),
    doSubmit: ({ text }) => {
      const submitPromise = dispatchProps.updateGeneralInfo(null, {
        personalSummary: text,
      });
      submitPromise.then(() => ownProps.setViewMode())
        .then(() => dispatchProps.loadInfo({ id: stateProps.id }))
        .catch(() => { });

      return submitPromise;
    },
  });
}

const ReduxSummaryEdit = reduxForm({
  form: forms.summary,
  enableReinitialize: true,
})(SummaryEdit);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxSummaryEdit);
