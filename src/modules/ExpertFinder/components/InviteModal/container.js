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
 * Created: January 27, 2017
 *
 */

import { Component, PropTypes } from 'react';
import actions from 'actions';
import { connect } from 'react-redux';
import { ModalUtils } from 'arachne-ui-components';
import { reduxForm } from 'redux-form';
import get from 'lodash/get';
import { modal, forms, roles } from 'modules/ExpertFinder/const';
import presenter from './presenter';
import selectors from './selectors';

class InviteModal extends Component {
  componentWillReceiveProps(props) {
    if (this.props.isOpened === false && props.isOpened === true) {
      this.props.getStudies({
        query: '',
        participantId: props.userToInvite,
      });
    }
  }

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state) {
  const name = get(state, 'modal.invite.data.name', '') || 'an expert';
  const userToInvite = get(state, 'modal.invite.data.id', -1);
  const studies = selectors.getStudies(get(state, 'expertFinder.studies'));

  return {
    inviteDialogTitle: `Invite ${name}`,
    userToInvite,
    userName: name,
    studies,
    isOpened: get(state, 'modal.invite.isOpened'),
    initialValues: {
      role: roles.CONTRIBUTOR.value,
    },
  };
}

const mapDispatchToProps = {
  hideInviteDialog: () => ModalUtils.actions.toggle(modal.invite, false, {}),
  showConfirmDialog: (study, user) => ModalUtils.actions.toggle(
    modal.inviteConfirm,
    true,
    { study, user }
  ),
  getStudies: actions.expertFinder.studies.query,
  inviteParticipant: actions.expertFinder.invitations.create,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...ownProps,
    ...dispatchProps,
    invite: ({ study, role }) => {
      const submitPromise = dispatchProps.inviteParticipant(
        { studyId: study },
        {
          userId: stateProps.userToInvite,
          role,
        }
      );
      submitPromise.then(() => {
        dispatchProps.hideInviteDialog();
        const selectedStudy = stateProps.studies.filter(element => element.value === study)[0];
        const user = {
          id: stateProps.userToInvite,
          name: stateProps.userName,
        };
        return dispatchProps.showConfirmDialog(selectedStudy, user);
      })
        .catch(() => {});

      return submitPromise;
    },
    getStudiesOptions: ({ query }) => {
      if (stateProps.userToInvite === -1) {
        return [];
      }
      return dispatchProps.getStudies({
        query,
        participantId: stateProps.userToInvite,
      });
    },
  };
}

InviteModal.propTypes = {
  getStudies: PropTypes.func,
  isOpened: PropTypes.bool,
};

let ReduxModalWindow = reduxForm({ form: forms.invite })(InviteModal);
ReduxModalWindow = ModalUtils.connect({ name: modal.invite })(ReduxModalWindow);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxModalWindow);
