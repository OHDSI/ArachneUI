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
 * Created: December 23, 2016
 *
 */

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { inviteActionTypes } from 'modules/Portal/const';
import get from 'lodash/get';
import ducks from 'modules/Portal/ducks';
import presenter from './presenter';
import selectors from './selectors';

class InvitationList extends Component {
  componentWillMount() {
    this.props.loadInvitations();
    this.props.subscribeToInvitations();
  }

  componentWillUnmount() {
    this.props.unsubscribeOfInvitations();
  }

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state) {
  const invitations = selectors.getInvitations(state);
  const unreadCount = invitations.length;
  const isLoading = get(state, 'portal.invitation.isLoading', false);

  return {
    invitations,
    unreadCount,
    isLoading,
  };
}

const mapDispatchToProps = {
  loadInvitations: ducks.actions.invitation.query,
  subscribeToInvitations: ducks.actions.invitation.subscribeToInvitations,
  unsubscribeOfInvitations: ducks.actions.invitation.unsubscribeOfInvitations,
  acceptInvitation: ducks.actions.invitation.acceptInvitation,
  rejectInvitation: ducks.actions.invitation.rejectInvitation,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...ownProps,
    ...dispatchProps,
    performAction: (type, invitationId, invitationType) => {
      let actionPromise;
      switch (type) {
        case inviteActionTypes.success:
          actionPromise = dispatchProps.acceptInvitation({
            id: invitationId,
            type: invitationType,
          });
          break;
        case inviteActionTypes.cancel:
          actionPromise = dispatchProps.rejectInvitation({
            id: invitationId,
            type: invitationType,
          });
          break;
        default:
          return false;
      }
      actionPromise.then(() => dispatchProps.loadInvitations())
        .catch(() => {});

      return actionPromise;
    },
  };
}

InvitationList.propTypes = {
  loadInvitations: PropTypes.func,
  unsubscribeOfInvitations: PropTypes.func,
  subscribeToInvitations: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(InvitationList);
