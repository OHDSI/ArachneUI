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
 * Created: December 14, 2016
 *
 */

import keyMirror from 'keymirror';
import { FormInput, FormSelect } from 'arachne-ui-components';

const form = keyMirror({
  remindPassword: null,
  resetPassword: null,
});

const actionTypes = keyMirror({
  //
  REQUEST_PROFESSIONAL_TYPES: null,
  RECEIVE_PROFESSIONAL_TYPES: null,
  //
  RECIEVE_AUTH_PRINCIPAL: null,
  //
  AUTH_REQUEST_EMAIL: null,
  AUTH_RECEIVE_EMAIL: null,
  AUTH_RECEIVE_METHOD: null,
});

const loginMessages = {
  registered: 'registered',
  emailConfirmed: 'email-confirmed',
  remindDone: 'password-remind-done',
  resetDone: 'password-reset-done',
  resendDone: 'email-resend-done',
};

const paths = {
  login(message) {
    const messageParam = message ? `?message=${message}` : '';
    return `/auth/login${messageParam}`;
  },
  register: () => '/auth/register',
  remindPassword: () => '/auth/remind-password',
  welcome: () => '/auth/welcome',
  resetPassword: () => '/auth/reset-password',
};

const apiPaths = {
  //
  professionalTypes: id => `/api/v1/user-management/professional-types${id ? `/${id}` : ''}`,
  //
  login: () => '/api/v1/auth/login',
  logout: () => '/api/v1/auth/logout',
  register: () => '/api/v1/auth/registration',
  remindPassword: () => '/api/v1/auth/remind-password',
  resetPassword: () => '/api/v1/auth/reset-password',
  resendEmail: () => '/api/v1/auth/resend-activation-email',
  //
  principal: () => '/api/v1/auth/me',
  authMethod: () => '/api/v1/auth/method',
};

const authMethods = keyMirror({
  LDAP: null,
  NATIVE: null,
});

const registerFields = function ({ professionalTypesOptions }) {

  return [
    {
      name: 'firstname',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'First Name',
          type: 'text',
          required: true,
        },
      },
    },
    {
      name: 'middlename',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Middle Name',
          type: 'text',
        },
      },
    },
    {
      name: 'lastname',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Last Name',
          type: 'text',
          required: true,
        },
      },
    },
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
    {
      name: 'password',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Password',
          type: 'password',
          required: true,
        },
      },
    },
    {
      name: 'passwordConfirmation',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Confirm password',
          type: 'password',
          required: true,
        },
      },
    },
    {
      name: 'professionalTypeId',
      InputComponent: {
        component: FormSelect,
        props: {
          mods: ['bordered'],
          placeholder: 'Professional type',
          options: professionalTypesOptions,
        },
      },
    },
  ];
}

export {
  actionTypes,
  authMethods,
  apiPaths,
  form,
  loginMessages,
  paths,
  registerFields,
};
