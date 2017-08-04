import { actionTypes } from 'modules/Auth/const';
import { LOCATION_CHANGE } from 'react-router-redux';

function setUserToken(state, action) {
  return { ...state, token: action.token };
}

function setBackUrl(state, action) {
  return { ...state, backUrl: action.data.url };
}

export default function (state = {}, action) {
  switch (action.type) {
    case actionTypes.SET_AUTH_TOKEN:
      return setUserToken(state, action);
    case actionTypes.SET_BACK_URL:
      return setBackUrl(state, action);
    default:
      return state;
  }
}
