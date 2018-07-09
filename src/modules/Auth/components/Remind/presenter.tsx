/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexandr Saltykov, Pavel Grafkin, Vitaly Koulakov, Anton Gackovka
 * Created: March 3, 2017
 *
 */

import * as React from 'react';
import {
  Button,
  Panel,
  Form,
  LoadingPanel,
  FormInput,
} from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import { paths } from 'modules/Auth/const';

require('./style.scss');

function Remind(props) {
  const classes = BEMHelper('remind');
  const {
    isLoading,
    doSubmit,
  } = props;
  const fields = [
    {
      name: 'email',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Email',
          type: 'text',
          required: true,
        },
      },
    },
  ];
  const submitBtn = {
    label: 'Send request',
    loadingLabel: 'Sending...',
  };

  return (
    <div {...classes()}>
      <Panel
        {...classes('form-panel')}
        title="Remind password"
      >
        <div {...classes('form-container')}>          
          <Form
            fields={fields}
            submitBtn={submitBtn}
            onSubmit={doSubmit}
            {...props}
          />
          <Button {...classes('back-btn')} link={paths.login()}>Back to login</Button>
          <LoadingPanel active={isLoading} />
        </div>
      </Panel>
    </div>
  );
}

export default Remind;


