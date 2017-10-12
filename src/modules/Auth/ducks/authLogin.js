import Duck from 'services/Duck';
import { apiPaths } from 'modules/Auth/const';
import AuthService from 'services/Auth';

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
      return (dispatch) => dispatch(actions.create({}, {username, password})).then((result) => {
          AuthService.setToken(result.result.token);
        });
      }
  },
  reducer,
};