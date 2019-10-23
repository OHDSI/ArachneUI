import Duck from 'services/Duck';
import { apiPaths } from 'modules/Submissions/const';

const actionCoreName = 'SUBMISSIONS_PANEL_ANALYSES_INVALIDATE';

const invalidateDuck = new Duck({
  name: actionCoreName,
  urlBuilder: apiPaths.invalidateAnalyses,
});

const actions = invalidateDuck.actions;
const reducer = invalidateDuck.reducer;

export default({
  actions,
  reducer,
});