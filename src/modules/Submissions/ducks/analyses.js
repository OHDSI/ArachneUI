import Duck from 'services/Duck';
import { apiPaths } from 'modules/Submissions/const';

const actionCoreName = 'SUBMISSIONS_PANEL_ANALYSES';

const invalidateDuck = new Duck({
  name: actionCoreName,
  urlBuilder: apiPaths.submissions,
});

const actions = invalidateDuck.actions;
const reducer = invalidateDuck.reducer;

export default ({
  actions,
  reducer,
});