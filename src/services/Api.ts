import * as authentication from 'feathers-authentication/client';
import * as feathers from 'feathers/client';
import * as hooks from 'feathers-hooks';
import * as rest from 'feathers-rest-arachne/client';
import * as superagent from 'superagent';

const authTokenName = 'Athena-Auth-Token';
const ssoLoginUrl = '/auth/login';

let API = feathers();

function configure() {
  /*const auth = authentication({
    header: authTokenName,
    storage: window.localStorage,
    tokenKey: authTokenName,
    // cookie: authTokenName,
    localEndpoint: '/auth/login',
    tokenEndpoint: '/auth/token',
  });*/

  API = API
    .configure(rest('/api/v1').superagent(superagent))
    .configure(hooks());
    //.configure(auth);

  API.hooks({
    before(hook) {
      const token = window.localStorage.getItem(authTokenName);
      if (token) {
        hook.params.headers = {
          ...hook.params.headers,
          [authTokenName]: token,
        }
      }
    },

    error(hook) {
      if (hook.error.status === 401) {
        //window.localStorage.removeItem(authTokenName);
        // alert('Open login iframe');

        window.location.href = ssoLoginUrl;

        /*window.open(
          ssoLoginUrl,
          '_blank',
          'height=600,width=800'
        );*/
      }
    }
  });

  return new Promise((resolve) => {resolve();}); //API.authenticate({ strategy: 'token' }).catch(() => {}); // 
}

export default API;
export {
  configure,
};