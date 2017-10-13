import Duck from 'services/Duck';
import { apiPaths } from 'modules/Auth/const';

const actionCoreName = 'AU_PRINCIPAL';

const principalDuck = new Duck(
  {
    name: actionCoreName,
    urlBuilder: apiPaths.principal,
  },
);

const actions = principalDuck.actions;
const reducer = principalDuck.reducer;

export default {
  actions,
  reducer,
};