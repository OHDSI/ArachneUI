import Duck from 'services/Duck';
import { apiPaths } from 'modules/Submissions/const';

const actionCoreName = 'SUBMISSIONS_PANEL_DATA_SOURCES_LIST';

const dataSourcesOptionListDuck = new Duck({
  name: actionCoreName,
  urlBuilder: apiPaths.dataSourcesOptionList,
});

const actions = dataSourcesOptionListDuck.actions;
const reducer = dataSourcesOptionListDuck.reducer;

export default {
  actions,
  reducer,
};