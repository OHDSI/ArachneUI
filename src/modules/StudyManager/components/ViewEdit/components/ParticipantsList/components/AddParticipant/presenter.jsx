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
  * Created: Wednesday, February 7, 2018 3:26 PM
  *
  */

  import React from 'react';
  import {
    Form,
    FormAutocomplete,
    FormSelect,
  } from 'arachne-ui-components';
  import BEMHelper from 'services/BemHelper';
  import { newParticipantRolesOptions } from 'modules/StudyManager/const';
  
  import './style.scss';
  
  function AddParticipant(props) {
    const classes = new BEMHelper('add-participant');
    
    const fields = [
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
            ...classes('participant'),
          },
        },
      },
      {
        name: 'role',
        InputComponent: {
          component: FormSelect,
          props: {
            mods: ['bordered'],
            placeholder: 'Role',
            options: newParticipantRolesOptions,
            ...classes('role'),
          },
        },
      },
    ];

    const submitBtn = {
      label: 'Add',
      loadingLabel: 'Adding...',
      mods: ['success', 'rounded'],
    };

    return (
      <div {...classes()}>
        <Form
          fields={fields}
          submitBtn={submitBtn}
          onSubmit={props.doSubmit}
          mods={['horizontal']}
          {...props}
        />
      </div>
    );
  }

  export default AddParticipant;
