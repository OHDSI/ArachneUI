import Duck from 'services/Duck';
import { apiPaths, paths, actionTypes } from 'modules/Auth/const';
import AuthService from 'services/Auth';
import actionsGlobal from 'actions';
import { isAuthModulePath } from 'modules/Auth/utils';
import { push as goToPage } from 'react-router-redux';
import URI from 'urijs';

const actionCoreName = 'AU_AUTH_LOGOUT';

const authLogoutDuck = new Duck(
  {
    name: actionCoreName,
    urlBuilder: apiPaths.logout,
  },
);

function recievePrincipal(principal) {
  return {
    type: actionTypes.AU_PRINCIPAL_QUERY_FULFILLED,
    payload: principal,
  };
}

const actions = authLogoutDuck.actions;
const reducer = authLogoutDuck.reducer;

export default {
  actions: {
    create: (backurl = '/') => {
      return (dispatch) => {
        dispatch(actions.create()).then(() => {
          AuthService.clearToken();
        });
        dispatch(recievePrincipal());
        if (actionsGlobal.studyManager) {
          actionsGlobal.studyManager.studyList.dropFilter();
        }
        // Redirect to auth screen if not already there
        const uri = new URI(backurl);
        if (!isAuthModulePath(uri.pathname())) {
          dispatch(goToPage(paths.login()));
        }
      }
    },
  },
  reducer,
};