/*
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
 * Authors: Anton Gackovka
 * Created: June 4, 2018
 */

import { Component, PropTypes } from 'react';
import actions from 'actions';
import get from 'lodash/get';
import { ContainerBuilder } from 'services/Utils';
import { goBack } from 'react-router-redux';
import presenter from './presenter';
import { studyKind } from 'modules/StudyManager/const';

export class Workspace extends Component {
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

    const userId = ownProps.params.userId;
    const moduleState = get(state, 'studyManager');
    const loggedUser = get(state, 'portal.myProfile.data.result', {});

    const workspaceData = get(moduleState, 'study.data', {});
    const isWorkspaceLoading = get(moduleState, 'study.isLoading');

    const studyId = get(workspaceData, 'id', null);

    const toolbarSettings = userId ? {
      userId,
      userName: get(workspaceData, 'leadParticipant.fullName', ''),
      title: 'Workspace',
    } : {
      userId: loggedUser.id,
      userName: `${loggedUser.firstname} ${loggedUser.middleName ? loggedUser.loggedUser : ''} ${loggedUser.lastname}`,
      title: 'MY Workspace',
    };
    
    return {
      studyId,
      toolbarSettings,
      isLoading: isWorkspaceLoading,
      studyTitle: 'workspace',
      userId,
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      goBack,
      loadInsights: actions.studyManager.studyInsights.find,
      loadWorkspace: actions.studyManager.study.find,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      onBannerActed: dispatchProps.loadWorkspace.bind(null, { id: ownProps.params.userId, kind: studyKind.WORKSPACE }),
    };
  }

  getFetchers({ params: { userId } }) {

    return {
      loadAnalysisTypeList: actions.studyManager.analysisTypes.find,
      loadWorkspace: actions.studyManager.study.find.bind(null, { id: userId, kind: studyKind.WORKSPACE }),
    };
  }

}
