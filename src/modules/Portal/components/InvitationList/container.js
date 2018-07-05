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
import { Notifier } from 'services/Notifier';
import { getTextActivity } from 'modules/Portal/components/InvitationList/ActivityListItem/presenter';

class InvitationList extends Component {
  async componentWillMount() {
    await this.props.loadInvitations();
    this.props.subscribeToInvitations();
  }

  componentWillUnmount() {
    this.props.unsubscribeOfInvitations();
  }
  
  componentWillReceiveProps(nextProps) {
    if (this.props.unreadCount < nextProps.unreadCount && nextProps.isSubscribed) {
      const message = nextProps.unreadCount > 1
        ? { body: 'New invitations pending your attention' }
        : getTextActivity(nextProps.invitations[0]);
      Notifier.alert({ message: message.body, icon: message.icon, useFallback: false });
    } 
  }  

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state) {
  const invitations = selectors.getInvitations(state);
  const unreadCount = invitations.length;
  const isLoading = get(state, 'portal.invitation.isLoading', false);
  const isSubscribed = get(state, 'portal.invitation.subscription.data.active', false);

  return {
    invitations,
    unreadCount,
    isLoading,
    isSubscribed,
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
