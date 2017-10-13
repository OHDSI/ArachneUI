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

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import get from 'lodash/get';
import { form } from 'modules/AnalysisExecution/const';
import actions from 'actions/index';
import presenter from './presenter';

class AnalysisDescrEdit extends Component {
  constructor() {
    super();
    this.setTextarea = this.setTextarea.bind(this);
  }

  componentDidMount() {
    if (this.textarea) {
      this.textarea.focus();
    }
  }

  setTextarea(textarea) {
    this.textarea = textarea;
  }

  render() {
    return presenter({
      ...this.props,
      setTextarea: this.setTextarea,
    });
  }
}

function mapStateToProps(state) {
  const analysisData = get(state, 'analysisExecution.analysis.data.result');

  return {
    analysisId: get(analysisData, 'id'),
    typeId: get(analysisData, 'type.id'),
    initialValues: {
      description: get(analysisData, 'description'),
    },
  };
}

const mapDispatchToProps = {
  load: actions.analysisExecution.analysis.find,
  updateAnalysis: actions.analysisExecution.analysis.update,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    setDescr: ({ description }) => dispatchProps
      .updateAnalysis({ id: stateProps.analysisId }, { description, typeId: stateProps.typeId })
      .then(() => dispatchProps.load({ id: stateProps.analysisId }))
      .then(ownProps.setViewMode),
    cancel: () => ownProps.setViewMode(),
  };
}

const ReduxAnalysisDescrEdit = reduxForm({
  form: form.analysisDescr,
  enableReinitialize: true,
})(AnalysisDescrEdit);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxAnalysisDescrEdit);
