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
import BEMHelper from 'services/BemHelper';
import { Link, Panel } from 'arachne-ui-components';
import { paths } from 'modules/Auth/const';

require('./style.scss');

function Welcome() {
  const classes = BEMHelper('welcome');
  const panelClasses = BEMHelper('welcome-panel');

  return (
    <div {...classes()}>
      <Panel
        {...panelClasses()}
        title="Welcome"
      >
        <div {...panelClasses('content')}>
          <p {...panelClasses('line')}>
            Thank you for registering with Athena.<br/>
            We have just sent you an email<br/>
            to confirm your account.
          </p>
          <p {...panelClasses('line')}>
            Please <Link to={paths.login()}>click here</Link> to return to login.
          </p>
        </div>
       </Panel>
    </div>
  );
}

export default Welcome;
