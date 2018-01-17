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
 * Created: December 13, 2016
 *
 */

import React, { Component, PropTypes } from 'react';
import { get, ContainerBuilder } from 'services/Utils';
import { refreshTime, analysisPermissions } from 'modules/AnalysisExecution/const';
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

  componentDidMount() {
    // TODO: only if window is in focus
    this.refreshInterval = setInterval(() => {
      this.isPolledData = true;
      this.props.loadAnalysis({ id: this.props.id });
    }, refreshTime);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      this.props.loadAnalysis({ id: nextProps.id }).then((analysis) => {
        const studyId = analysis.result.study.id;
        this.props.loadStudyDataSources({ studyId });
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.refreshInterval);
    this.props.unloadAnalysis();
  }

  render() {
    return <Presenter {...this.props} isLoading={this.props.isLoading && !this.isPolledData} />;
  }
}

export default class ViewEditAnalysisBuilder extends ContainerBuilder {
  getComponent() {
    return ViewEditAnalysis;
  }

  mapStateToProps(state, ownProps) {
    const analysis = get(state, 'analysisExecution.analysis');
    const analysisData = get(analysis, 'data.result');
    const pageTitle = [
      get(analysisData, 'title', 'Analysis'),
      get(analysisData, 'study.title', 'Study'),
      'Arachne',
    ];
    const studyId = get(analysisData, 'study.id', -1);

    return {
      id: parseInt(ownProps.routeParams.analysisId, 10),
      studyId,
      isLoading: get(analysis, 'isLoading', false),
      pageTitle: pageTitle.join(' | '),
      isEditable: get(analysisData, `permissions[${analysisPermissions.editAnalysis}]`, false),
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

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      onBannerActed: () => dispatchProps.loadAnalysis({ id: stateProps.id }),
    };
  }

  getFetchers({ params, dispatch, getState }) {
    const componentActions = this.getMapDispatchToProps();
    return {
      loadAnalysisWDataSources: dispatch(componentActions.loadAnalysis({ id: params.analysisId }))
        .then(() => {
          const studyId = getState().analysisExecution.analysis.data.result.study.id;
          return dispatch(componentActions.loadStudyDataSources({ studyId }));
        }),
      loadTypeList: componentActions.loadTypeList,
    };
  }
}
