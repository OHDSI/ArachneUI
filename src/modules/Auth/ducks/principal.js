import Duck from 'services/Duck';
import { apiPaths, actionTypes } from 'modules/Auth/const';

const actionCoreName = 'AU_PRINCIPAL';

const principalDuck = new Duck(
  {
    name: actionCoreName,
    urlBuilder: apiPaths.principal,
  },
);

const actions = principalDuck.actions;
const reducer = principalDuck.reducer;

function recievePrincipal(principalz) {
  return {
    type: actionTypes.RECIEVE_AUTH_PRINCIPAL,
    payload: principal,
  };
}

export default {
  actions/*: {
    query: () => {
      return (dispatch) => {
        dispatch(principalDuck.actions.query()).then((result) => dispatch({
          type: actionTypes.RECIEVE_AUTH_PRINCIPAL,
          payload: result,
        }));
        //recievePrincipal(get(dispatch.state, 'auth.principal.queryResult.result', [], 'Array'));
      }
    }
  }*/,
  reducer,
  recievePrincipal,
};