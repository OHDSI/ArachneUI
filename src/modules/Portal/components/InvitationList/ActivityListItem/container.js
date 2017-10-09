/**
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
 * Created: July 25, 2017
 *
 */

import { connect } from 'react-redux';
import { inviteActionTypes, modal } from 'modules/Portal/const';
import { ModalUtils } from 'arachne-ui-components';
import ActivityListItem from './presenter';

function mapStateToProps() {
  return {
  };
}

const mapDispatchToProps = {
  showCommentForm: (invitationId, invitationType) =>
    ModalUtils.actions.toggle(modal.rejectInvitation, true,
      {
        invitationId,
        invitationType,
      }),
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    doAction(type, invitationId, invitationType) {
      switch (type) {
        case inviteActionTypes.success:
          return ownProps.performAction(type, invitationId, invitationType);
        case inviteActionTypes.cancel:
          return dispatchProps.showCommentForm(invitationId, invitationType);
        default:
          return false;
      }
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ActivityListItem);
