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
 * Created: February 21, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { PageContent } from 'arachne-ui-components';
import { Link } from 'arachne-ui-components';
import { paths } from 'modules/Auth/const';

require('modules/Auth/styles/auth.scss');
require('./style.scss');

function Welcome({ message }) {
  const classes = new BEMHelper('auth');
  const formClasses = new BEMHelper('form-welcome');
  const colorScheme = __APP_TYPE_NODE__ ? 'node' : 'default';

  return (
    <PageContent mods={['bg-primary']} colorScheme={colorScheme} title='Welcome | Arachne'>
      <div {...classes()}>
        <div {...classes('title')}>
					Welcome
				</div>
        <div {...classes('form')}>
          <div {...formClasses()}>
            <p {...formClasses('line')}>
              Thank you for registering with Arachne.<br/>
              We have just sent you an email<br/>
              to confirm your account.
            </p>
            <p {...formClasses('line')}>
              Please <Link to={paths.login()}>click here</Link> to return to login.
            </p>
          </div>
        </div>
      </div>
    </PageContent>
  );
}

export default Welcome;
