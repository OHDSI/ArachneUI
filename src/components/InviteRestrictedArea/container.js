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
 * Created: July 13, 2017
 *
 */

import { Component, PropTypes } from 'react';
import actions from 'actions';
import { ContainerBuilder, get } from 'services/Utils';
import { goBack } from 'react-router-redux';
import SelectorsBuilder from './selectors';
import presenter from './presenter';

const selectors = (new SelectorsBuilder()).build();

class InviteRestrictedArea extends Component {
  static get propTypes() {
    return {
      studyId: PropTypes.number,
      className: PropTypes.string,
      onBannerActed: PropTypes.func,
    };
  }

  render() {
    return presenter(this.props);
  }
}

export default class InviteRestrictedAreaBuilder extends ContainerBuilder {
  getComponent() {
    return InviteRestrictedArea;
  }

  mapStateToProps(state, ownProps) {
    const moduleState = get(state, 'studyManager');
    const isLoading = get(moduleState, 'study.isLoading', true);

    const studyId = ownProps.studyId;
    
    return {
      studyId: studyId,
      accessGranted: studyId !== null,
      invitation: selectors.getInvitation(state, studyId),
      isLoading,
    };
  }

  getMapDispatchToProps() {
    return {
      goBack,
      loadInvitations: actions.portal.invitation.query,
      acceptInvitation: actions.portal.invitation.acceptInvitation,
      rejectInvitation: actions.portal.invitation.rejectInvitation,
      loadStudy: actions.studyManager.study.find,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      onAccept: () => {
        dispatchProps.acceptInvitation({
          id: stateProps.invitation.id,
          type: stateProps.invitation.type,
        })
        .then(() => dispatchProps.loadInvitations())
        .then(ownProps.onAction)
      },
      onDecline: ownProps.onAction,
    };
  }

}
