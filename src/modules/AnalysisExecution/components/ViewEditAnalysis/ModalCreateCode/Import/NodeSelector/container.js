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
 * Created: July 03, 2017
 *
 */

// import { Component } from 'react';
import { connect } from 'react-redux';
import {
  reduxForm,
} from 'redux-form';
import { form } from 'modules/AnalysisExecution/const';
import { get } from 'services/Utils';
import NodeSelector from './presenter';
import selectors from './selectors';

function mapStateToProps(state, ownProps) {
  const analysisType = get(state, 'analysisExecution.analysis.data.result.type.id', '', 'String');

  return {
    dataNodeList: selectors.getDataNodes(state),
    totalSteps: ownProps.totalSteps,
    step: ownProps.step,
    analysisType,
  };
}

const mapDispatchToProps = {
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
  };
}

const ReduxImportNodeSelector = reduxForm({
  form: form.importNodeSelector,
})(NodeSelector);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ReduxImportNodeSelector);
