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
 * Created: January 16, 2017
 *
 */

import React from 'react';
import { Modal } from 'arachne-ui-components';
import { Form } from 'arachne-ui-components';
import { FormFileInput } from 'arachne-ui-components';
import { modalSubmitBtnConfig } from 'modules/ExpertFinder/const';


function UserPicModal(props) {
  const formFields = [
    {
      name: 'image',
      InputComponent: {
        component: FormFileInput,
        props: {
          mods: 'bordered',
          placeholder: 'Browse file',
          dropzonePlaceholder: 'Drag and drop photo',
          multiple: false,
        },
      },
    },
  ];

  return (
    <Modal modal={props.modal} title="Add Photo">
      <Form
        fields={formFields}
        onSubmit={props.doSubmit}
        submitBtn={modalSubmitBtnConfig}
        {...props}
      />
    </Modal>
    );
}

export default UserPicModal;