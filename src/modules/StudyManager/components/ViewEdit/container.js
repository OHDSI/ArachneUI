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

import { Component, PropTypes } from 'react';
import actions from 'actions';
import get from 'lodash/get';
import { ContainerBuilder } from 'services/Utils';
import { push as goToPage } from 'react-router-redux';
import { paths as workspacePaths } from 'modules/Workspace/const';
import { studyKind, participantRoles as roles } from 'modules/StudyManager/const';
import presenter from './presenter';

export class ViewEditStudy extends Component {
  static get propTypes() {
    return {
      id: PropTypes.number,
      studyTitle: PropTypes.string,
      isLoading: PropTypes.bool,
      accessGranted: PropTypes.bool,
      loadTypeList: PropTypes.func,
      loadAnalysisTypeList: PropTypes.func,
      loadStatusList: PropTypes.func,
      loadStudy: PropTypes.func,
      loadInsights: PropTypes.func,
      loadTransitions: PropTypes.func,
    };
  }

  componentWillMount() {
    this.state = {
      openedSection: 'Documents',
    };
    this.onTabChange = this.onTabChange.bind(this);
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.kind && this.props.participants && this.props.kind === studyKind.WORKSPACE) {
      const leadId = this.props.participants.find(v => v.role.id = roles.LEAD_INVESTIGATOR).id;
      this.props.goToWorkspace(leadId);
      return;
    }
    if (this.props.id !== nextProps.id && nextProps.id) {
      this.props.loadTypeList();
      this.props.loadAnalysisTypeList();
      this.props.loadStatusList();
      this.props.loadStudy({ id: nextProps.id });
      this.props.loadInsights({ studyId: nextProps.id });
      this.props.loadTransitions({ studyId: nextProps.id });
    }
  }

  onTabChange(openedSection) {
    this.setState({
      openedSection,
    });
  }

  render() {
    return presenter({
      ...this.props,
      ...this.state,
      onTabChange: this.onTabChange,
    });
  }
}

export default class ViewEditStudyBuilder extends ContainerBuilder {
  getComponent() {
    return ViewEditStudy;
  }

  mapStateToProps(state, ownProps) {
    const moduleState = get(state, 'studyManager');
    const studyData = get(moduleState, 'study.data', {});
    const pageTitle = [
      studyData ? get(studyData, 'title') : '',
      'My studies',
    ];
    const isStudyLoading = get(moduleState, 'study.isLoading');
    const isTypesLoading = get(moduleState, 'typeList.isLoading');
    const participants = get(studyData, 'participants');
    const isParticipantsLoading = get(participants, 'isSaving');
    
    const kind = studyData.kind;
    
    return {
      id: parseInt(ownProps.routeParams.studyId, 10),
      studyTitle: pageTitle.join(' | '),
      isLoading: isStudyLoading || isTypesLoading || isParticipantsLoading || get(state, 'studyManager.studyInvitations.isLoading'),
      participants,
      kind,
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      loadTypeList: actions.studyManager.typeList.find,
      loadAnalysisTypeList: actions.studyManager.analysisTypes.find,
      loadStatusList: actions.studyManager.statusList.find,
      loadStudy: actions.studyManager.study.find,
      loadInsights: actions.studyManager.studyInsights.find,
      loadTransitions: actions.studyManager.availableTransitions.query,
      goToWorkspace: leadId => goToPage(workspacePaths.userWorkspace(leadId)),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      onBannerActed: () => dispatchProps.loadStudy({ id: stateProps.id }),
    };
  }

  getFetchers({ params }) {
    const studyId = params.studyId;
    return {
      loadTypeList: actions.studyManager.typeList.find,
      loadAnalysisTypeList: actions.studyManager.analysisTypes.find,
      loadStatusList: actions.studyManager.statusList.find,
      loadStudy: () => actions.studyManager.study.find({ id: studyId }),
      loadInsights: () => actions.studyManager.studyInsights.find({ studyId }),
      loadTransitions: () => actions.studyManager.availableTransitions.query({ studyId }),
    };
  }

}
