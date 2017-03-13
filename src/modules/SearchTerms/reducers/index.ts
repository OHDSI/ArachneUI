import { combineReducers } from 'redux';
import services from '../apiServices';

import termList from './termList';

export default combineReducers({
	termList,
	terms: services.terms.reducer,
	facets: services.facets.reducer,
});
