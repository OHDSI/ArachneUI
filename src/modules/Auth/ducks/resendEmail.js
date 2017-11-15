import Duck from 'services/Duck';
import { apiPaths } from 'modules/Auth/const';

const actionCoreName = 'AU_RESEND_EMAIL';

const authMethodDuck = new Duck(
  {
    name: actionCoreName,
    urlBuilder: apiPaths.resendEmail,
  },
);

const actions = authMethodDuck.actions;
const reducer = authMethodDuck.reducer;


export default {
  actions,
  reducer,
};