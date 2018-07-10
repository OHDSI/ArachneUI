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

import { actionTypes } from 'modules/Auth/const';
import { push as goToPage } from 'react-router-redux';
import { authTokenName } from 'const';
import * as _ from 'lodash';

function setToken(token: string) {
  if (token) {
    window.localStorage.setItem(authTokenName, token);
  } else {
    window.localStorage.removeItem(authTokenName);    
  }
  return {
    type: actionTypes.SET_AUTH_TOKEN,
    token,
  };
}

function setBackUrl(url: string) {
  return {
    type: actionTypes.SET_BACK_URL,
    data: { url },
  };
}

export default {
  setToken,
  setBackUrl,
};
