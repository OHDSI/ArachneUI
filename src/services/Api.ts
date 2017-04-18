import * as authentication from 'feathers-authentication/client';
import * as feathers from 'feathers/client';
import * as hooks from 'feathers-hooks';
import * as rest from 'feathers-rest-arachne/client';
import * as superagent from 'superagent';

const authTokenName = 'athena-Auth-Token';

let API = feathers();

function configure() {
	API = API
	  .configure(rest('/api/v1').superagent(superagent))
	  .configure(hooks())
	  .configure(authentication({
	  	header: authTokenName,
	  	storage: window.localStorage,
	  }));
}

export default API;
export {
	configure,
};