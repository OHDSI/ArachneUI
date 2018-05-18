import Duck from 'services/Duck';
import { apiPaths } from 'modules/Admin/const';

const actionCoreName = 'AD_TENANT_LIST';

const adminListDuck = new Duck({
  name: actionCoreName,
  urlBuilder: apiPaths.tenants,
});

const actions = adminListDuck.actions;
const reducer = adminListDuck.reducer;

export default {
  actions,
  reducer,
};