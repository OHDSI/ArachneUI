import { combineReducers } from 'redux';
import services from '../apiServices';

export default combineReducers({
	buildInfo: services.buildInfo.reducer,
});
