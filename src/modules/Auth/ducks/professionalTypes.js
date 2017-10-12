import Duck from 'services/Duck';
import { apiPaths } from 'modules/Auth/const';

const actionCoreName = 'AU_PROFESSIONAL_TYPE';

const professionalTypesDuck = new Duck(
  {
    name: actionCoreName,
    urlBuilder: apiPaths.professionalTypes,
  },
);

const actions = professionalTypesDuck.actions;
const reducer = professionalTypesDuck.reducer;


export default {
  actions,
  reducer,
};