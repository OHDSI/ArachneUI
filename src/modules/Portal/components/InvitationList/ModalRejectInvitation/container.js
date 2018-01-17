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
 * Created: July 25, 2017
 *
 */

import { connect } from 'react-redux';
import { reduxForm, reset as resetForm } from 'redux-form';
import get from 'lodash/get';

import actions from 'actions';
import { ModalUtils } from 'arachne-ui-components';
import { modal, form } from 'modules/Portal/const';
import ModalRejectInvitation from './presenter';

function mapStateToProps(state) {
  return {
    invitationId: get(state, `modal.${modal.rejectInvitation}.data.invitationId`),
    invitationType: get(state, `modal.${modal.rejectInvitation}.data.invitationType`),
  };
}

const mapDispatchToProps = {
  closeModal: () => ModalUtils.actions.toggle(modal.rejectInvitation, false),
  resetForm: () => resetForm(form.rejectInvitation),
  rejectInvitation: (params, data) =>
    actions.portal.invitation.rejectInvitation(params, data),
  loadInvitations: (params, data) =>
    actions.portal.invitation.query(params, data),
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    doSubmit({ comment }) {
      const submitPromise = dispatchProps.rejectInvitation({
        id: stateProps.invitationId,
        type: stateProps.invitationType,
        comment,
      });

      submitPromise
        .then(() => dispatchProps.closeModal())
        .then(() => dispatchProps.resetForm())
        .then(() => dispatchProps.loadInvitations())
        .then(ownProps.onDecline)
        .catch(() => {});

      return submitPromise;
    },
  };
}

let ReduxModalRejectInvitation = ModalUtils.connect({
  name: modal.rejectInvitation,
})(ModalRejectInvitation);

ReduxModalRejectInvitation = reduxForm({
  form: form.rejectInvitation,
})(ReduxModalRejectInvitation);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxModalRejectInvitation);
