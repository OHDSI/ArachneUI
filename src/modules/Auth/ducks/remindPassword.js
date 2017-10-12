import Duck from 'services/Duck';
import { apiPaths } from 'modules/Auth/const';

const actionCoreName = 'AU_REMIND_PASSWORD';

const remindPasswordDuck = new Duck(
  {
    name: actionCoreName,
    urlBuilder: apiPaths.remindPassword,
  },
);

const actions = remindPasswordDuck.actions;
const reducer = remindPasswordDuck.reducer;


export default {
  actions,
  reducer,
};