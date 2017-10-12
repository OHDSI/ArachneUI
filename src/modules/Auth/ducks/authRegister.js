import Duck from 'services/Duck';
import { apiPaths } from 'modules/Auth/const';

const actionCoreName = 'AU_AUTH_REGISTER';

const authRegisterDuck = new Duck(
  {
    name: actionCoreName,
    urlBuilder: apiPaths.register,
  },
);

const actions = authRegisterDuck.actions;
const reducer = authRegisterDuck.reducer;


export default {
  actions,
  reducer,
};