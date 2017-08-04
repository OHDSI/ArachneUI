import { combineReducers } from 'redux';
import core from './core';
import services from '../apiServices';

export default combineReducers({
	core,
	logout: services.auth_logout.reducer,
	principal: services.auth_principal.reducer,
	professionalTypes: services.auth_professionalTypes.reducer,
});
