import * as get from 'lodash/get';
import { push as goToPage } from 'react-router-redux';
import { authTokenName, loginPath as rawLoginPath } from 'const';
import authActions from 'modules/Auth/actions';
import { IStoreAsync } from 'stores/configureStore';

const loginPath = rawLoginPath + '?forceSSO=true';

class Auth {
	private store: IStoreAsync;

	setStore = (store) => {
		this.store = store;
	}

	loadAuthTokenFromLS = () => {
		const cachedAuthToken = window.localStorage.getItem(authTokenName);

		if (cachedAuthToken) {
			this.store.dispatch(authActions.core.setToken(cachedAuthToken));
		}
	}

	getAuthToken = () => {
		return get(this.store.getState(), 'auth.core.token');
	};

	onAccessDenied = () => {
		const backUrl = window.location.href;
		this.store.dispatch(
			authActions.core.setBackUrl(backUrl)
		);
		this.store.dispatch(
      goToPage(loginPath)
    );
	};

	requireOnPathEnter = (nextState, replace, callback) => {
	  const token = localStorage.getItem(authTokenName);
	  if (!token) {
	  	const backUrl = nextState.location.pathname;
	  	this.store.dispatch(
	  		authActions.core.setBackUrl(backUrl)
	  	);
	  	replace(loginPath);
	  }
	  return callback();
	}

}

const singletonAuth = new Auth();

export default singletonAuth;
