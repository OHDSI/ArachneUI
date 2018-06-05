/*
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
 * Authors: Anton Gackovka
 * Created: June 4, 2018
 */

import { Component, PropTypes } from 'react';
import actions from 'actions';
import get from 'lodash/get';
import { ContainerBuilder } from 'services/Utils';
import { goBack } from 'react-router-redux';
import presenter from './presenter';
import {recentActivityPageSize} from "../../../../../../src/modules/StudyManager/const";

export class Workspace extends Component {
  componentWillReceiveProps(nextProps) {

    if (this.props.studyId !== nextProps.studyId) {
      actions.studyManager.recentActivity.find({
        studyId: nextProps.studyId,
        pageSize: recentActivityPageSize
      })
    }
  }
  render() {
    return presenter({
      ...this.props,
      ...this.state,
    });
  }
}

export default class WorkspaceBuilder extends ContainerBuilder {
  getComponent() {
    return Workspace;
  }

  mapStateToProps(state, ownProps) {
    const moduleState = get(state, 'studyManager');
    const studyData = get(moduleState, 'study.data.result');
    const pageTitle = [
      studyData ? get(studyData, 'title') : '',
      'My studies',
    ];
    const isStudyLoading = get(moduleState, 'study.isLoading');
    
    return {
      studyId: get(studyData, 'id'),
      id: get(studyData, 'id'),
      studyTitle: pageTitle.join(' | '),
      isLoading: isStudyLoading || get(state, 'studyManager.studyInvitations.isLoading'),
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      goBack,
      loadAnalysisTypeList: actions.studyManager.analysisTypes.find,
      loadStudy: actions.studyManager.study.find,
      loadInsights: actions.studyManager.studyInsights.find,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      onBannerActed: () => dispatchProps.loadStudy(stateProps.id),
    };
  }

  getFetchers({ params }) {
    const studyId = 1;
    return {
      loadAnalysisTypeList: actions.studyManager.analysisTypes.find,
      loadStudy: () => actions.studyManager.study.find(studyId),
    };
  }

}
