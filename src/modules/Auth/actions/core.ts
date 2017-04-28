import { actionTypes } from 'modules/Auth/const';
import { push as goToPage } from 'react-router-redux';
import { authTokenName } from 'const';

function setToken(token: string) {
  window.localStorage.setItem(authTokenName, token);
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
    window.localStorage.removeItem(authTokenName);
    dispatch(setToken(null));
    dispatch(goToPage('/'));
  };
}

export default {
  logout,
  setToken,
  setBackUrl,
};
