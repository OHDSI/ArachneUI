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
 * Created: February 02, 2017
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import authDucks from 'modules/Auth/ducks';
import Logout from './presenter';
import { get } from 'services/Utils';

function mapStateToProps(state) {
  return {
    authMode: get(state, 'auth.authMode.data.result.mode')
  }
}

const mapDispatchToProps = {
  iapLogout: () => {
      window.location = '/_gcp_iap/clear_login_cookie';
  },
  logout: () => authDucks.actions.logout(),

};


export default connect(mapStateToProps, mapDispatchToProps)(Logout);
