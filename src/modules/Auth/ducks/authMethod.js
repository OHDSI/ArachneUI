import Duck from 'services/Duck';
import { apiPaths } from 'modules/Auth/const';

const actionCoreName = 'AU_AUTH_METHOD';

const authMethodDuck = new Duck(
  {
    name: actionCoreName,
    urlBuilder: apiPaths.authMethod,
  },//
);

const actions = authMethodDuck.actions;
const reducer = authMethodDuck.reducer;


export default {
  actions,
  reducer,
};