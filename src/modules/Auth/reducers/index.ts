import { combineReducers } from 'redux';
import core from './core';
import services from '../apiServices';

export default combineReducers({
	core,
	principal: services.auth_principal.reducer,
});
