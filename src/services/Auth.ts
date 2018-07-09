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
