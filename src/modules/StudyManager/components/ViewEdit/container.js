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

// @ts-check
import { Component } from 'react';
import actions from 'actions';
import get from 'lodash/get';
import { Utils } from 'services/Utils';
import { goBack } from 'react-router-redux';
import presenter from './presenter';

export class ViewEditStudy extends Component {
  render() {
    return presenter(this.props);
  }
}

export default class ViewEditStudyBuilder {
  getComponent() {
    return ViewEditStudy;
  }

  mapStateToProps(state, ownProps) {
    const moduleState = get(state, 'studyManager');
    const studyData = get(moduleState, 'study.data.result');
    const pageTitle = [
      studyData ? get(studyData, 'title') : '',
      'My studies',
    ];
    const isStudyLoading = get(moduleState, 'study.isLoading');
    const isTypesLoading = get(moduleState, 'typeList.isLoading');

    return {
      id: parseInt(ownProps.routeParams.studyId, 10),
      studyTitle: pageTitle.join(' | '),
      isLoading: isStudyLoading || isTypesLoading,
      accessGranted: studyData !== null,
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      goBack,
    };
  }

  getFetchers({ params }) {
    const studyId = params.studyId;
    return {
      loadTypeList: actions.studyManager.typeList.find,
      loadAnalysisTypeList: actions.studyManager.analysisTypes.find,
      loadStatusList: actions.studyManager.statusList.find,
      loadStudy: () => actions.studyManager.study.find(studyId),
      loadInsights: () => actions.studyManager.studyInsights.find({ studyId }),
      loadTransitions: () => actions.studyManager.availableTransitions.query({ studyId }),
      loadSudyInvitations: () => actions.studyManager.studyInvitations.query({ studyId }),
    };
  }

  build() {
    return Utils.buildConnectedComponent({
      Component: this.getComponent(),
      mapStateToProps: this.mapStateToProps,
      mapDispatchToProps: this.getMapDispatchToProps(),
      getFetchers: this.getFetchers,
    });
  }

}
