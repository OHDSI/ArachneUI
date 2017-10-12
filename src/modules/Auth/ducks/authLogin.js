import Duck from 'services/Duck';
import { apiPaths, actionTypes } from 'modules/Auth/const';
import AuthService from 'services/Auth';
import get from "lodash/get";
import { push as goToPage } from 'react-router-redux';

const actionCoreName = 'AU_AUTH_LOGIN';

const authLoginDuck = new Duck(
  {
    name: actionCoreName,
    urlBuilder: apiPaths.login,
  },
);

const actions = authLoginDuck.actions;
const reducer = authLoginDuck.reducer;


export default {
  actions: {
    create: (username, password) => {
      return (dispatch) => dispatch(actions.create({}, {username: username, password: password})).then((result) => {
          AuthService.setToken(result.result.token);
        });
        // Persist login token
        //const token = get(state, 'auth.authLogin.queryResult.result.token');
        //AuthService.setToken(token);
        // prevent from returning to logout page
        //const backUrl = (/\/auth\/logout/i).test(redirectTo) ? '/' : redirectTo;
        //dispatch(goToPage(backUrl || '/'));
        // Load principal
        //dispatch(actions.auth.principal.find);
      }
  },
  reducer,
};