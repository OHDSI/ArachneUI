import Duck from 'services/Duck';
import { apiPaths } from 'modules/Submissions/const';

const actionCoreName = 'SUBMISSIONS_PANEL_LIST';

const submissionListDuck = new Duck({
  name: actionCoreName,
  urlBuilder: apiPaths.submissionList,
});

const actions = submissionListDuck.actions;
const reducer = submissionListDuck.reducer;

export default {
  actions,
  reducer,
};