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
 * Created: December 13, 2017
 *
 */

import React from 'react';
import {
  FormTextarea,
  Modal,
  Form,
} from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';

import './style.scss';

export default function DeclineInvitation(props) {
  const classes = new BEMHelper('invite-banner-modal');

  const fields = [
    {
      name: 'reason',
      InputComponent: {
        component: FormTextarea,
        props: {
          mods: ['bordered'],
          placeholder: 'Reason',
        },
      },
    },
  ];

  const submitBtn = {
    label: 'Submit',
    loadingLabel: 'Submitting...',
    mods: ['success', 'rounded'],
  };

  const cancelBtn = {
    label: 'Cancel',
  };

  return (
    <Modal modal={props.modal} title="Decline invitation">
      <div {...classes()}>
        <Form
          mods="spacing-sm"
          fields={fields}
          submitBtn={submitBtn}
          cancelBtn={cancelBtn}
          onSubmit={(data) => {
            props.onDecline(data)
              .then(props.modal.close);
          }}
          onCancel={props.modal.close}
          {...props}
        />
      </div>
    </Modal>
  );
}
