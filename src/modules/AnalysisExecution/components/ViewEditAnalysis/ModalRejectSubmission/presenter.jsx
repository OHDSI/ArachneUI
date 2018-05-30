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
 * Created: July 19, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { Modal, Form, FormTextarea } from 'arachne-ui-components';

require('./style.scss');

function ModalRejectSubmission(props) {
  const classes = new BEMHelper('submission-reject-form');

  const fields = [
    {
      name: 'comment',
      InputComponent: {
        component: FormTextarea,
        props: {
          mods: ['bordered'],
          placeholder: 'Comment',
        },
      },
    },
  ];

  const submitBtn = {
    label: 'Save',
    loadingLabel: 'Saving...',
    mods: ['success', 'rounded'],
  };

  const cancelBtn = {
    label: 'Cancel',
  };

  return (
    <Modal modal={props.modal} title="Reject submission">
      <div {...classes()}>
        <p {...classes('preface')}>
          Before you proceed, please specify a reason for rejection:
        </p>
        <Form
          mods="spacing-sm"
          fields={fields}
          submitBtn={submitBtn}
          cancelBtn={cancelBtn}
          onSubmit={props.doSubmit}
          onCancel={props.modal.close}
          {...props}
        />
      </div>
    </Modal>
  );
}

export default ModalRejectSubmission;
