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
 * Created: July 25, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { Form, FormInput } from 'arachne-ui-components';

require('./style.scss');

function LinkUpload(props) {
  const classes = new BEMHelper('insight-form-attach-link');
  const fields = [
    {
      name: 'label',
      className: 'col-xs-12 col-md-6',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Name document',
          type: 'text',
        }
      },
    },
    {
      name: 'link',
      className: 'col-xs-12 col-md-6',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Link to file',
          type: 'text',
        }
      },
    },
  ];

  const submitBtn = {
    label: 'Add',
    loadingLabel: 'Adding...',
    mods: ['success', 'rounded'],
  };

  return (
    <Form
      {...classes({ extra: 'row' })}
      {...props}
      actionsClassName="col-xs-12"
      fields={fields}
      submitBtn={submitBtn}
      onSubmit={props.doSubmit}
    />
  );
}

export default LinkUpload;
