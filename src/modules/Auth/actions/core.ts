import { actionTypes } from 'modules/Auth/const';
import { push as goToPage } from 'react-router-redux';
import { authTokenName } from 'const';

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

function logout() {
  return dispatch => {
    window.open('https://localhost:8443/cas/logout', 'SSO logout', "width=600,height=450,scrollbars=no");
    dispatch(setToken(null));
    dispatch(goToPage('/'));
  };
}

export default {
  logout,
  setToken,
  setBackUrl,
};
