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

import React, { Component, PropTypes } from 'react';
import { Utils, get } from 'services/Utils';
import actions from 'actions/index';
import Presenter from './presenter';

class ViewEditAnalysis extends Component {
  get propTypes() {
    return {
      id: PropTypes.number.isRequired,
      loadAnalysis: PropTypes.func.isRequired,
      loadStudyDataSources: PropTypes.func.isRequired,
      loadTypeList: PropTypes.func,
      studyId: PropTypes.number,
      unloadAnalysis: PropTypes.func.isRequired,
    };
  }

  componentWillReceiveProps(nextProps) {
    // Loading of available Data Sources for Submission modal
    // TODO: rebuilt in a better way
    if (nextProps.studyId !== this.props.studyId) {
      this.props.loadStudyDataSources({ studyId: nextProps.studyId });
    }
    if (nextProps.id !== this.props.id) {
      this.props.loadAnalysis({ id: nextProps.id });
    }
  }

  componentWillUnmount() {
    this.props.unloadAnalysis();
  }

  render() {
    return <Presenter {...this.props} />;
  }
}

export default class ViewEditAnalysisBuilder {
  getComponent() {
    return ViewEditAnalysis;
  }

  mapStateToProps(state, ownProps) {
    const moduleState = state.analysisExecution;
    const pageTitle = [
      get(moduleState, 'analysis.data.result.title', 'Analysis'),
      get(state, 'analysisExecution.analysis.data.result.study.title', 'Study'),
      'Arachne',
    ];

    return {
      id: parseInt(ownProps.routeParams.analysisId, 10),
      studyId: get(moduleState, 'analysis.data.result.study.id'),
      isLoading: get(moduleState, 'analysis.isLoading', false),
      pageTitle: pageTitle.join(' | '),
    };
  }

  getMapDispatchToProps() {
    return {
      loadAnalysis: actions.analysisExecution.analysis.find,
      loadTypeList: actions.analysisExecution.analysisTypes.query,
      unloadAnalysis: actions.analysisExecution.analysis.unload,
      loadStudyDataSources: actions.analysisExecution.studyDataSourceList.query,
    };
  }

  getFetchers({ params, state, dispatch }) {
    return {
      loadAnalysis: actions.analysisExecution.analysis.find.bind(null, { id: params.analysisId }),
      loadTypeList: actions.analysisExecution.analysisTypes.query,
    };
  }

  build() {
    return Utils.buildConnectedComponent({
      Component: this.getComponent(),
      mapStateToProps: this.mapStateToProps,
      mapDispatchToProps: this.getMapDispatchToProps(),
      mergeProps: this.mergeProps,
      getFetchers: this.getFetchers,
    });
  }
}

