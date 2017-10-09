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
 * Created: April 26, 2017
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Form,
  FormInput,
  Panel,
} from 'arachne-components';

require('./style.scss');

function FormPassword(props) {
  const classes = new BEMHelper('portal-settings-form-password');
  const {
    className,
    doSubmit,
  } = props;
  
  const passwordFormFields = [
    {
      name: 'oldPassword',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Old password',
          type: 'password'
        }
      },
    },
    {
      name: 'password',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'New password',
          type: 'password'
        }
      },
    },
    {
      name: 'passwordConfirmation',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'New password confirmation',
          type: 'password'
        }
      },
    },
  ];

  const submitBtn = {
    label: 'Change',
    loadingLabel: 'Changing...',
    mods: ['success', 'rounded'],
  }

  return (
    <Panel
      {...classes({ extra: className })}
      title="Change password"
    >
      <Form
        fields={passwordFormFields}
        onSubmit={doSubmit}
        submitBtn={submitBtn}
        {...props}
        {...classes('form')}
      />
    </Panel>
  );
}

export default FormPassword;
