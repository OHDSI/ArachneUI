import Duck from 'services/Duck';
import { apiPaths } from 'modules/Auth/const';
import AuthService from 'services/Auth';

const actionCoreName = 'AU_TOKEN';

const token = new Duck(
  {
    name: actionCoreName,
    urlBuilder: apiPaths.refresh,
  },
);

const actions = token.actions;
const reducer = token.reducer;

export default {
  actions: {
    refresh: () => {
      return (dispatch) => dispatch(actions.create({}))
        .then((result) => {
          AuthService.setToken(result.result);
        });
      },
  },
  reducer,
};
