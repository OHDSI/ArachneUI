import * as authentication from 'feathers-authentication/client';
import * as feathers from 'feathers/client';
import * as hooks from 'feathers-hooks';
import * as rest from 'feathers-rest-arachne/client';
import * as superagent from 'superagent';
import { get } from 'lodash';
import { SubmissionError } from 'redux-form';

import { authTokenName } from 'const';


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
    .configure(rest('/api/v1').superagent(superagent, {withCredentials: true}))
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
          throw new SubmissionError({
            _error: get(hook, 'error.errorMessage', ''),
            ...validationErrors,
          });
        }
      }
    }
  });

  return new Promise((resolve) => {resolve();}); //API.authenticate({ strategy: 'token' }).catch(() => {}); // 
}

export default API;
export {
  configure,
};