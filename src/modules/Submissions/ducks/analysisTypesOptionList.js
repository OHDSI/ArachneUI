import Duck from 'services/Duck';
import { apiPaths } from 'modules/Submissions/const';

const actionCoreName = 'SUBMISSIONS_PANEL_ANALYSIS_TYPES_LIST';

const analysisTypesOptionListDuck = new Duck({
  name: actionCoreName,
  urlBuilder: apiPaths.analysisTypesOptionList,
});

const actions = analysisTypesOptionListDuck.actions;
const reducer = analysisTypesOptionListDuck.reducer;

export default {
  actions,
  reducer,
};