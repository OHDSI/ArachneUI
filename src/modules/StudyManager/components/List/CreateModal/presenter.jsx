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
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: December 13, 2016
 *
 */

import React from 'react';
import { Modal } from 'arachne-ui-components';
import { Form } from 'arachne-ui-components';
import { FormInput } from 'arachne-ui-components';
import { FormSelect } from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';

require('./style.scss');

function CreateModal(props) {
  const classes = new BEMHelper('form-create-study');
  
  const fields = [
    {
      name: 'title',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Name of study',
          type: 'text',
        }
      },
    },
    {
      name: 'typeId',
      InputComponent: {
        component: FormSelect,
        props: {
          mods: ['bordered'],
          placeholder: 'Type',
          options: props.studyTypes
        }
      },
    },
  ];

  const submitBtn = {
    label: 'Create',
    loadingLabel: 'Creating...',
  }

  const cancelBtn = {
    label: 'Cancel',
  }

  return (
  	<Modal modal={props.modal} title="Create study">
  		<div {...classes()}>
  			<Form
  				fields={fields}
  				submitBtn={submitBtn}
          cancelBtn={cancelBtn}
  				onSubmit={props.createStudy}
          onCancel={props.modal.close}
  				{...props}
  			/>
  		</div>
  	</Modal>
  );
}

export default CreateModal;