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
 * Created: February 07, 2017
 *
 */

import React from 'react';
import {
  Form,
  FormAutocomplete,
  Modal,
} from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';

require('./style.scss');

function ModalInviteDataSource(props = {}) {
  const classes = new BEMHelper('data-catalog-form-invite-ds');
  const {
    loadStudyOptions,
    modalTitle = 'Attach data source',
    studyOptions,
    modal,
  } = props;

  const fields = [
    {
      name: 'studyId',
      InputComponent: {
        component: FormAutocomplete,
        props: {
          mods: ['bordered'],
          placeholder: 'Search Study By Name',
          options: studyOptions,
          fetchOptions: loadStudyOptions,
          clearable: false,
        },
      },
    },
  ];

  const submitBtn = {
    label: 'Add',
    loadingLabel: 'Adding...',
    mods: ['success', 'rounded'],
  };

  const cancelBtn = {
    label: 'Cancel',
  };

  return (
    <Modal modal={modal} title={modalTitle}>
      <div {...classes()}>
        <Form
          mods="spacing-sm"
          fields={fields}
          submitBtn={submitBtn}
          cancelBtn={cancelBtn}
          onSubmit={props.doSubmit}
          onCancel={modal.close}
          {...props}
        />
      </div>
    </Modal>
  );
}

export default ModalInviteDataSource;