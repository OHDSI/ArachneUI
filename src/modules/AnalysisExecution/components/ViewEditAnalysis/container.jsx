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
 * Created: December 13, 2016
 *
 */

import React, { Component, PropTypes } from 'react';
import { get, Utils, isViewable } from 'services/Utils';
import { refreshTime, analysisPermissions, submissionGroupsPageSize, modal } from 'modules/AnalysisExecution/const';
import { modal as studyModal } from 'modules/StudyManager/const';
import actions from 'actions/index';
import isEqual from 'lodash/isEqual';
import qs from 'qs';
import { ModalUtils } from 'arachne-ui-components';
import Presenter from './presenter';
import { ActiveModuleAwareContainerBuilder } from 'modules/StudyManager/utils';

export function getFilter(search) {
  let filter = Utils.getFilterValues(search);
  if ('hasInsight' in filter && filter.hasInsight === 'false') {
    delete filter.hasInsight;
  }
  if ('showHidden' in filter && filter.showHidden === 'false') {
    delete filter.showHidden;
  }
  filter = qs.stringify(filter, { arrayFormat: 'repeat' });
  return filter;
}

class ViewEditAnalysis extends Component {
  static get propTypes() {
    return {
      id: PropTypes.number.isRequired,
      loadAnalysis: PropTypes.func.isRequired,
      loadStudyDataSources: PropTypes.func.isRequired,
      loadTypeList: PropTypes.func,
      studyId: PropTypes.number,
      unloadAnalysis: PropTypes.func.isRequired,
      loadSubmissionGroups: PropTypes.func,
      filter: PropTypes.string,
    };
  }

  componentDidMount() {
    // TODO: only if window is in focus
    this.refreshInterval = setInterval(() => {
      this.isPolledData = true;
      this.props.loadAnalysis({ id: this.props.id });
      this.props.loadSubmissionGroups({ analysisId: this.props.id, page: this.props.page, filter: this.props.filter });
    }, refreshTime);
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      const analysis = await this.props.loadAnalysis({ id: nextProps.id });
      const studyId = analysis.result.study.id;
      this.props.setActiveModule(analysis.result.study.kind);
      this.props.loadStudyDataSources({ studyId });
    }
    if (nextProps.id !== this.props.id || nextProps.page !== this.props.page || !isEqual(this.props.filter, nextProps.filter)) {
      this.props.loadSubmissionGroups({ analysisId: nextProps.id, page: nextProps.page, filter: nextProps.filter });
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

export default class ViewEditAnalysisBuilder extends ActiveModuleAwareContainerBuilder {
  getComponent() {
    return ViewEditAnalysis;
  }

  mapStateToProps(state, ownProps) {
    const analysis = get(state, 'analysisExecution.analysis');
    const isSubmissionGroupsLoading = get(state, 'analysisExecution.submissionGroups.isLoading', false);
    const analysisData = get(analysis, 'data.result');
    const pageTitle = [
      get(analysisData, 'title', 'Analysis'),
      get(analysisData, 'study.title', 'Study'),
      'Arachne',
    ];
    const studyId = get(analysisData, 'study.id', -1);
    const currentQuery = state.routing.locationBeforeTransitions.query;
    const filter = getFilter(state.routing.locationBeforeTransitions.search);
    const canView = isViewable(analysis.data);

    return {
      id: parseInt(ownProps.routeParams.analysisId, 10),
      studyId,
      isLoading: get(analysis, 'isLoading', false) || isSubmissionGroupsLoading,
      pageTitle: pageTitle.join(' | '),
      isEditable: get(analysisData, `permissions[${analysisPermissions.editAnalysis}]`, false),
      page: get(currentQuery, 'page', 1),
      filter,
      canView,
    };
  }

  getMapDispatchToProps() {
    return {
      ...super.getMapDispatchToProps(),
      loadAnalysis: actions.analysisExecution.analysis.find,
      loadTypeList: actions.analysisExecution.analysisTypes.query,
      unloadAnalysis: actions.analysisExecution.analysis.unload,
      loadStudyDataSources: actions.analysisExecution.studyDataSourceList.query,
      loadSubmissionGroups: ({ page = 1, analysisId, filter }) => {
        const pageSize = submissionGroupsPageSize;
        return actions.analysisExecution.submissionGroups.query({ page, pageSize, analysisId, filter });
      },
      hideInviteModal: () => ModalUtils.actions.toggle(studyModal.addDataSource, false),
      showSubmitModal: () => ModalUtils.actions.toggle(modal.submitCode, true),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      ...super.mergeProps(stateProps, dispatchProps, ownProps),
      onBannerActed: async () => {
        await dispatchProps.loadAnalysis({ id: stateProps.id });
        return dispatchProps.loadSubmissionGroups({ analysisId: stateProps.id, page: stateProps.page, filter: stateProps.filter });
      },
      refreshStudyDataSources() {
        dispatchProps.hideInviteModal();
        dispatchProps.showSubmitModal();
        dispatchProps.loadStudyDataSources({ studyId: stateProps.studyId });
      }
    };
  }

  getFetchers({ params, dispatch, getState }) {
    const componentActions = this.getMapDispatchToProps();
    const currentQuery = getState().routing.locationBeforeTransitions.query;
    const page = get(currentQuery, 'page', 1);
    const filter = getFilter(getState().routing.locationBeforeTransitions.search);
    return {
      ...super.getFetchers({ params, dispatch, getState }),
      loadAnalysisWDataSources: dispatch(componentActions.loadAnalysis({ id: params.analysisId }))
        .then((analysis) => {
          const studyId = get(analysis, 'result.study.id');
          const kind = get(analysis, 'result.study.kind');
          this.setKind(kind);
          if (isViewable(analysis)) {
            dispatch(componentActions.loadSubmissionGroups({ analysisId: params.analysisId, page, filter }));
            dispatch(componentActions.loadStudyDataSources({ studyId }));
          }
        }),
      loadTypeList: componentActions.loadTypeList,
    };
  }
}
