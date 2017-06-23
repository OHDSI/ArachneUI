import { combineReducers } from 'redux';
import services from '../apiServices';

export default combineReducers({
	vocabularies: services.vocabularies.reducer,
	licenses: services.licenses.reducer,
	users: services.users.reducer,
});
