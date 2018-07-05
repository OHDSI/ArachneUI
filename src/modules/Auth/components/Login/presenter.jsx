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
 * Created: December 27, 2016
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';

import { PageContent } from 'arachne-ui-components';
import { loginMessages } from 'modules/Auth/const';
import FormLogin from './FormLogin/index';

require('modules/Auth/styles/auth.scss');

function Login({ message }) {
  const classes = new BEMHelper('auth');
  const colorScheme = __APP_TYPE_NODE__ ? 'node' : 'default';

  let messageText;
  switch (message) {
    case loginMessages.registered:
      messageText = 'Thank you for registration with Arachne. We have just sent you an email to confirm your account.';
      break;
    case loginMessages.emailConfirmed:
      messageText = 'Thank you for email confirmation. Now you can login.';
      break;
    case loginMessages.remindDone:
      messageText = 'Link for password reset was sent to your email.';
      break;
    case loginMessages.resetDone:
      messageText = 'Password was reset successfully.';
      break;
    case loginMessages.resendDone:
      messageText = 'Confirmation has been sent to your email.';
      break;
  }

  return (
    <PageContent mods={['bg-primary']} colorScheme={colorScheme} title='Login | Arachne'>
      <div {...classes()}>
        <div {...classes('title')}>
					Login
				</div>
        {messageText &&
        <div {...classes('descr')}>
          {messageText}
        </div>
				}
        <div {...classes('form')}>
          <FormLogin />
        </div>
      </div>
    </PageContent>
  );
}

export default Login;
