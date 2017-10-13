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
 * Created: December 13, 2016
 *
 */

import { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, reset as resetForm, change } from 'redux-form';
import get from 'lodash/get';

import actions from 'actions/index';
import { ModalUtils } from 'arachne-ui-components';
import { modal, form } from 'modules/AnalysisExecution/const';
import presenter from './presenter';
import selectors from './selectors';

class ModalSubmitCode extends Component {
  componentWillReceiveProps(props) {
    if (props.analysisId && !this.props.isOpened && props.isOpened === true) {
      this.props.loadStudyDataSources({ studyId: props.studyId });
    }
  }

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state) {
  const analysisData = get(state, 'analysisExecution.analysis.data.result');
  const isOpened = get(state, 'modal.submitCode.isOpened', false);
  const dataSourceOptions = selectors.getDataSourceOptions(state);
  const selectedDN = [];
  const values = get(state, 'form.submitCode.values.dataSources', []);
  for (const id in values) { // eslint-disable-line no-restricted-syntax
    if (values[id] === true) {
      selectedDN.push(parseInt(id, 0));
    }
  }
  const isAllSelected = dataSourceOptions.length === selectedDN.length;


  return {
    analysisId: get(analysisData, 'id'),
    studyId: get(analysisData, 'study.id'),
    dataSourceOptions: selectors.getDataSourceOptions(state),
    isOpened,
    isAllSelected,
  };
}

const mapDispatchToProps = {
  submitCode: actions.analysisExecution.submission.create,
  loadAnalysis: actions.analysisExecution.analysis.find,
  closeModal: () => ModalUtils.actions.toggle(modal.submitCode, false),
  resetForm: resetForm.bind(null, form.submitCode),
  toggle: (id, isSelected) => change(form.submitCode, `dataSources[${id}]`, isSelected),
  loadStudyDataSources: actions.analysisExecution.studyDataSourceList.query,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    doSubmit({ dataSources = [] }) {
      const dataSourceIds = [];
      dataSources.forEach((ds, id) => // eslint-disable-line no-confusing-arrow
          ds === true ? dataSourceIds.push(id) : null);
      if (!dataSourceIds.length) {
        return false;
      }

      const submitPromise = dispatchProps.submitCode(
        {
          analysisId: stateProps.analysisId,
        },
        {
          dataSources: dataSourceIds,
        }
      );

      submitPromise
        .then(() => dispatchProps.resetForm())
        .then(() => dispatchProps.closeModal())
        .then(() => dispatchProps.loadAnalysis(({ id: stateProps.analysisId })))
        .catch(() => {});

      // We have to return a submission promise back to redux-form
      // to allow it update the state
      return submitPromise;
    },
    toggleAll: () =>
      stateProps.dataSourceOptions.forEach(dataSource =>
        dispatchProps.toggle(dataSource.value, !stateProps.isAllSelected)),
  };
}

let ReduxModalCreateCode = ModalUtils.connect({
  name: modal.submitCode,
})(ModalSubmitCode);

ReduxModalCreateCode = reduxForm({
  form: form.submitCode,
})(ReduxModalCreateCode);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxModalCreateCode);
