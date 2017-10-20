import Duck from 'services/Duck';
import { apiPaths } from 'modules/Auth/const';

const actionCoreName = 'AU_RESET_PASSWORD';

const resetPasswordDuck = new Duck(
  {
    name: actionCoreName,
    urlBuilder: apiPaths.resetPassword,
  },
);

const actions = resetPasswordDuck.actions;
const reducer = resetPasswordDuck.reducer;


export default {
  actions,
  reducer,
};