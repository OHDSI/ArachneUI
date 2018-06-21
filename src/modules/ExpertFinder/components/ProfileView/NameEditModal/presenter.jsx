/*
 *
 * Copyright 2018 Observational Health Data Sciences and Informatics
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
import { FormInput } from 'arachne-ui-components';
import { cancelBtnConfig } from 'modules/ExpertFinder/const';

function NameEditModal(props) {
  const {
    hideDialog,
    edit,
    modal,
  } = props;
  const classes = new BEMHelper('invite-modal');
  const formFields = [
    {
      name: 'firstname',
      InputComponent: {
        component: FormInput,
        props: {
          placeholder: 'First Name',
          required: true,
          type: 'text',
          mods: 'bordered',
        },
      }
    },
    {
      name: 'middlename',
      InputComponent: {
        component: FormInput,
        props: {
          placeholder: 'Middle Name',
          required: false,
          type: 'text',
          mods: 'bordered',
        },
      }
    },
    {
      name: 'lastname',
      InputComponent: {
        component: FormInput,
        props: {
          placeholder: 'Last Name',
          required: true,
          type: 'text',
          mods: 'bordered',
        },
      }
    }
  ];
  const submitBtnConfig = {
    label: 'Save',
    loadingLabel: 'Saving',
    mods: ['submit', 'rounded'],
  };

  return (
    <Modal modal={modal} title='Edit Name'>
      <Form
        fields={formFields}
        addButtonTitle="Save"
        onSubmit={edit}
        onCancel={hideDialog}
        submitBtn={submitBtnConfig}
        cancelBtn={cancelBtnConfig}
        {...props}
      />
    </Modal>);
}

NameEditModal.propTypes = {
  hideDialog: PropTypes.func,
  edit: PropTypes.func,
  modal: PropTypes.any,
};

export default NameEditModal;
