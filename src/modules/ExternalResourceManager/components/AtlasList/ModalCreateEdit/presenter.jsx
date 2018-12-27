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
 * Authors: Pavel Grafkin
 * Created: March 15, 2018
 *
 */

import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Form,
  FormInput,
  FormSelect,
  Modal,
  LoadingPanel,
} from 'arachne-ui-components';
import { atlasAuthTypeList } from 'modules/ExternalResourceManager/const';
import './style.scss';

function ModalCreateEdit(props) {
  const classes = new BEMHelper('modal-atlas-create-edit');
  const {
    isLoading,
    id,
    doSubmit,
  } = props;

  let modalTitle;
  let submitBtn;
  if (id) {
    modalTitle = 'Edit Atlas connection';
    submitBtn = {
      label: 'Save',
      loadingLabel: 'Saving...',
    };
  } else {
    modalTitle = 'Create Atlas connection';
    submitBtn = {
      label: 'Create',
      loadingLabel: 'Creating...',
    };
  }

  const cancelBtn = {
    label: 'Cancel',
  };

  const fields = [
    {
      name: 'name',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Name of Atlas connection',
          required: true,
          type: 'text',
        },
      },
    },
    {
      name: 'url',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Atlas url',
          required: true,
          type: 'text',
        },
      },
    },
    {
      name: 'authType',
      InputComponent: {
        component: FormSelect,
        props: {
          mods: ['bordered'],
          placeholder: 'Atlas auth type',
          required: true,
          options: Object.values(atlasAuthTypeList),
        },
      },
    },
    {
      name: 'username',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Username',
          type: 'text',
        },
      },
    },
    {
      name: 'password',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Password',
          type: 'password',
        },
      },
    },
  ];

  return (
    <Modal modal={props.modal} title={modalTitle}>
      <Form
        {...classes()}
        actionsClassName="col-xs-12"
        fields={fields}
        submitBtn={submitBtn}
        cancelBtn={cancelBtn}
        onSubmit={doSubmit}
        onCancel={props.modal.close}
        {...props}
      />
      <LoadingPanel active={isLoading} />
    </Modal>
  );
}

export default ModalCreateEdit;
