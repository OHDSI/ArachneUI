import Duck from 'services/Duck';
import { apiPaths } from 'modules/Auth/const';

let actionCoreName = 'AU_AUTH_METHODS';
const allAuthMethodsDuck = new Duck({
    name: actionCoreName,
    urlBuilder: apiPaths.allAuthMethods
});

const actions = allAuthMethodsDuck.actions;
const reducer = allAuthMethodsDuck.reducer;

export default {
  actions: actions,
  reducer: reducer
};
