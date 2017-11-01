import Duck from 'services/Duck';
import { apiPaths } from 'modules/Auth/const';

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
    refresh: actions.create,
  },
  reducer,
};
