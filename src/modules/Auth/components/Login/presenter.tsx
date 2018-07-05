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
  Link,
  Panel
} from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import { paths, messages } from 'modules/Auth/const';
import { get } from 'lodash';

require('./style.scss');

interface ILoginProps {
  goToSSO: Function;
  message: string;
}

function Login(props: ILoginProps) {
  const {
    goToSSO,
    message,
  } = props;
  const classes = BEMHelper('login');

  return (
    <div {...classes()}>
      <Panel title='Login or register to access'>
        <div {...classes('modal-content')}>
          <p {...classes('text')}>
            This item requires authorization.<br/>
            Please login or register to access.
          </p>
          {message === messages.REMIND_SUCCESS &&
            <p {...classes('text', 'success')}>
              <p {...classes('text')}>
                Please, check your email for futher instructions.
              </p>
            </p>
          }
          {message === messages.RESET_SUCCESS &&
            <p {...classes('text', 'success')}>
              <p {...classes('text')}>
                You've successfuly reset your password.
              </p>
            </p>
          }
          <Button
            {...classes('login')}
            onClick={goToSSO}
          >
            Click here to login
          </Button>
          <Button
            {...classes('register')}
            link={paths.register()}
          >
            Click here to register
          </Button>
          <Button
            {...classes('remind-password')}
            link={paths.remindPassword()}
          >
            Remind password
          </Button>
        </div>
      </Panel>
    </div>
  );
}

export default Login;
