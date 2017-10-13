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
 * Created: January 27, 2017
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import { Modal } from 'arachne-ui-components';
import { Form } from 'arachne-ui-components';
import { FormAutocomplete, FormSelect } from 'arachne-ui-components';
import { cancelBtnConfig, roles } from 'modules/ExpertFinder/const';

require('./style.scss');

function InviteModal(props) {
  const {
    getStudiesOptions,
    hideInviteDialog,
    invite,
    inviteDialogTitle,
    modal,
    studies,
  } = props;
  const classes = new BEMHelper('invite-modal');
  const formFields = [
    {
      name: 'study',
      InputComponent: {
        component: FormAutocomplete,
        props: {
          placeholder: 'Search Study By Name',
          required: true,
          fetchOptions: getStudiesOptions,
          options: studies,
          canCreateNewOptions: false,
          mods: ['bordered'],
        },
      },
    },
    {
      name: 'role',
      InputComponent: {
        component: FormSelect,
        props: {
          placeholder: 'User role',
          required: true,
          options: Object.values(roles),
          mods: ['bordered'],
        },
      },
    },
  ];
  const submitBtnConfig = {
    label: 'Invite',
    loadingLabel: 'Inviting',
    mods: ['submit', 'rounded'],
  };

  return (
    <Modal modal={modal} title={inviteDialogTitle}>
      <Form
        {...classes('invite-form')}
        fields={formFields}
        addButtonTitle="Invite"
        onSubmit={invite}
        onCancel={hideInviteDialog}
        submitBtn={submitBtnConfig}
        cancelBtn={cancelBtnConfig}
        mods={['spacing-actions-sm']}
        {...props}
      />
    </Modal>);
}

InviteModal.propTypes = {
  getStudiesOptions: PropTypes.func,
  hideInviteDialog: PropTypes.func,
  invite: PropTypes.func,
  inviteDialogTitle: PropTypes.string,
  modal: PropTypes.any,
  studies: PropTypes.array,
};

export default InviteModal;
