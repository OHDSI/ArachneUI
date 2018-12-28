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

import * as authentication from 'feathers-authentication/client';
import * as feathers from 'feathers/client';
import * as hooks from 'feathers-hooks';
import * as rest from 'feathers-rest-arachne/client';
import * as superagent from 'superagent';
import { get, set } from 'lodash';
import { SubmissionError } from 'redux-form';
import Auth from 'services/Auth';
import { Api as OhdsiApi } from 'ohdsi-ui-toolbox';

import { authTokenName } from 'const';

const corePath = '/api/v1';
let API = feathers();

interface ApiConfig {
  getAuthToken: Function;
  onAccessDenied: Function;
};

function configure(props: ApiConfig): Promise<any> {
  /*const auth = authentication({
    header: authTokenName,
    storage: window.localStorage,
    tokenKey: authTokenName,
    // cookie: authTokenName,
    localEndpoint: '/auth/login',
    tokenEndpoint: '/auth/token',
  });*/
  const {
    getAuthToken,
    onAccessDenied
  } = props;

  API = API
    .configure(rest(corePath).superagent(superagent, {withCredentials: true}))
    .configure(hooks());
    //.configure(auth);

  API.hooks({
    before(hook) {
      const token = getAuthToken(authTokenName);
      if (token) {
        hook.params.headers = {
          ...hook.params.headers,
          [authTokenName]: token,
        }
      }
    },

    after(hook) {
      const errorMessage = get(hook, 'result.errorMessage', '');
      if (errorMessage) {
        throw new Error(errorMessage);
      }
    },

    error(hook) {
      if (hook.error.status === 401) {
        onAccessDenied();
      } else {
        const validationErrors = get(hook, 'error.validatorErrors');
        if (validationErrors) {
          const errors = {
            _error: get(hook, 'error.errorMessage', ''),
          };
          Object.keys(validationErrors).forEach(reKey => set(errors, reKey, validationErrors[reKey]));
          throw new SubmissionError(errors);
        }
      }
    }
  });

  return new Promise((resolve) => {resolve();}); //API.authenticate({ strategy: 'token' }).catch(() => {}); // 
}

const ohdsiApi = new OhdsiApi();
ohdsiApi.setApiHost(corePath);
ohdsiApi.setAuthTokenHeader(authTokenName);
ohdsiApi.setUserTokenGetter(() => Auth.getAuthToken());
ohdsiApi.handleUnexpectedError = er => console.error('Oooops!.. Something went wrong :(');

export default API;
export {
  configure,
  ohdsiApi,
};