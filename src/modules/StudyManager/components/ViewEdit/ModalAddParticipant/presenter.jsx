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
 * Created: December 13, 2016
 *
 */

import React from 'react';
import { Modal } from 'arachne-ui-components';
import { Form } from 'arachne-ui-components';
import { FormInput, FormSelect } from 'arachne-ui-components';
import { FormAutocomplete } from 'arachne-ui-components';
import { newParticipantRolesOptions } from 'modules/StudyManager/const';
import BEMHelper from 'services/BemHelper';

require('./style.scss');

function ModalAddParticipant(props) {
  const classes = new BEMHelper('study-form-add-participant');
  
  const fields = [
    {
      name: 'role',
      InputComponent: {
        component: FormSelect,
        props: {
          mods: ['bordered'],
          placeholder: 'Role',
          options: newParticipantRolesOptions
        }
      },
    },
    {
      name: 'participantId',
      InputComponent: {
        component: FormAutocomplete,
        props: {
          mods: ['bordered'],
          placeholder: 'Search by name',
          options: props.participantOptions,
          fetchOptions: props.loadParticipantOptions,
          clearable: false,
        }
      }
    },
  ];

  const submitBtn = {
    label: 'Add',
    loadingLabel: 'Adding...',
    mods: ['success', 'rounded'],
  }

  const cancelBtn = {
    label: 'Cancel',
  }

  return (
  	<Modal modal={props.modal} title="Add participant">
  		<div {...classes()}>
  			<Form
          mods="spacing-actions-sm"
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

export default ModalAddParticipant;