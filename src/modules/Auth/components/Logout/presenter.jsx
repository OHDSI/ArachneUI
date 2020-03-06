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
 * Created: February 01, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { Link } from 'arachne-ui-components';
import { authenticationModes } from 'modules/Auth/const';

require('./style.scss');

function Logout({ logout, iapLogout, authMode }) {
  const classes = new BEMHelper('user-menu');
  if (authMode === authenticationModes.Proxy) {
    return (
      <div {...classes()}>
        <Link {...classes('link', 'iconified')} onClick={iapLogout}>power_settings_new</Link>
        <iframe id='google-iap-refresher' src='/_gcp_iap/session_refresher' {...classes('iap', 'iframe')}></iframe>
      </div>
    );
  }

  return (
    <div {...classes()}>
      <Link {...classes('link', 'iconified')} onClick={logout}>power_settings_new</Link>
    </div>
  );
}

export default Logout;
