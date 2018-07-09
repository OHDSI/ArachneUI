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

import keyMirror = require('keymirror');

const actionTypes = keyMirror({
  SET_AUTH_TOKEN: null,
  SET_BACK_URL: null,
});

const messages = keyMirror({
  REMIND_SUCCESS: null,
  RESET_SUCCESS: null,
});

const paths = {
	login: ({ message = '' } = {}) => `/auth/login${message ? `?message=${messages[message]}` : ''}`,
	register: () => '/auth/register',
  welcome: () => '/auth/welcome',
  remindPassword: () => '/auth/remind-password',
};

const forms = keyMirror({
  register: null,
  remind: null,
  reset: null,
});

const apiPaths = {
  myUserpic: hash => `/api/v1/user-management/users/avatar/${hash ? `?${hash}` : ''}`,
};

const roles = keyMirror({
  ROLE_USER: null,
  ROLE_ADMIN: null,
});

export {
  actionTypes,
  apiPaths,
  forms,
  paths,
  roles,
  messages,
};
