import Duck from 'services/Duck';
import { apiPaths } from 'modules/Submissions/const';

const actionCoreName = 'SUBMISSIONS_PANEL_ENVIRONMENT_LIST';

const environmentListDuck = new Duck({
  name: actionCoreName,
  urlBuilder: apiPaths.environmentList,
});

const actions = environmentListDuck.actions;
const reducer = environmentListDuck.reducer;

export default {
  actions,
  reducer,
};