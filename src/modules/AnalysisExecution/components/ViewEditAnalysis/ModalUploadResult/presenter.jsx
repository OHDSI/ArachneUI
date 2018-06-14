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
 * Created: March 14, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Modal,
  Form,
  FormInput,
  FormFileInput
} from 'arachne-ui-components';
import get from 'lodash/get';

require('./style.scss');

function ModalSubmitCode(props) {
  const classes = new BEMHelper('analysis-form-upload-result');

  const fields = [
    {
      name: 'result',
      InputComponent: {
        component: FormFileInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Add link or browse document',
          dropzonePlaceholder: 'Drag and drop document',
          multiple: true,
          filePlaceholder: 'Document name',
        },
      },
    },
  ];

  const submitBtn = {
    label: 'Upload',
    loadingLabel: 'Uploading...',
    mods: ['success', 'rounded'],
  };

  const cancelBtn = {
    label: 'Cancel',
  };

  return (
    <Modal modal={props.modal} title="Add result files">
      <div {...classes()}>
        <Form
          mods="spacing-sm"
          fields={fields}
          submitBtn={submitBtn}
          cancelBtn={cancelBtn}
          onSubmit={props.doSubmit}
          onCancel={() => { props.resetForm(); props.closeModal() }}
          {...props}
        />
      </div>
    </Modal>
  );
}

export default ModalSubmitCode;
