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
      studyId: PropTypes.number.isRequired,
      className: PropTypes.string,
      onBannerActed: PropTypes.func.isRequired,
    };
  }

  componentWillMount() {
    if (this.props.studyId !== -1) {
      // in case of studyManager module, to prevent double request for study
      this.props.loadSudyInvitations({ studyId: this.props.studyId });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.studyId !== nextProps.studyId && nextProps.studyId !== -1) {
      nextProps.loadStudy(nextProps.studyId);
      nextProps.loadSudyInvitations({ studyId: nextProps.studyId });
    }
  }

  render() {
    return presenter(this.props);
  }
}

export default class InviteRestrictedAreaBuilder extends ContainerBuilder {
  getComponent() {
    return InviteRestrictedArea;
  }

  mapStateToProps(state) {
    const moduleState = get(state, 'studyManager');
    const studyData = get(moduleState, 'study.data.result', null);
    const isLoading = get(moduleState, 'study.isLoading', true);

    return {
      accessGranted: studyData !== null,
      invitation: selectors.getInvitation(state),
      isLoading,
    };
  }

  getMapDispatchToProps() {
    return {
      goBack,
      loadSudyInvitations: actions.studyManager.studyInvitations.query,
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
        .then(ownProps.onAction)
        .then(() => dispatchProps.loadSudyInvitations({ studyId: ownProps.studyId }));
      },
      onDecline: ownProps.onAction,
    };
  }

}
