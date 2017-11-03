import { combineReducers } from 'redux';
import authLogin from './authLogin';
import authLogout from './authLogout';
import principal from './principal';
import authMethod from './authMethod';
import authRegister from './authRegister';
import professionalType from './professionalTypes';
import remindPassword from './remindPassword';
import resetPassword from './resetPassword';
import resendEmail from  './resendEmail';
import token from './token';
import { isAuthModulePath } from 'modules/Auth/utils';
import { LOCATION_CHANGE } from 'react-router-redux';

function setBackUrl(state, action) {
  return !isAuthModulePath(action.payload.pathname) ? { ...state, backUrl: action.payload.pathname } : state;
}

const authRoutingHistory = (state = {}, action) => {
      return action.type === LOCATION_CHANGE ? setBackUrl(state, action) : state;
};

const actions = {
  login: authLogin.actions.create,
  logout: authLogout.actions.create,
  principal: principal.actions,
  authMethod: authMethod.actions,
  register: authRegister.actions.create,
  professionalType: professionalType.actions,
  remindPassword: remindPassword.actions,
  resetPassword: resetPassword.actions,
  resendEmail: resendEmail.actions.create,
  token: token.actions,
};

const reducer = combineReducers({
  authLogin: authLogin.reducer,
  authLogout: authLogout.reducer,
  principal: principal.reducer,
  authMethod: authMethod.reducer,
  authRegister: authRegister.reducer,
  professionalType: professionalType.reducer,
  remindPassword: remindPassword.reducer,
  resetPassword: resetPassword.reducer,
  resendEmail: resendEmail.reducer,
  authRoutingHistory,
  token: token.reducer,
});

export default {
  actions,
  reducer,
};