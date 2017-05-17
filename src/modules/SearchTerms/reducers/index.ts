import { combineReducers } from 'redux';
import services from '../apiServices';

import termList from './termList';
import graph from './graph';

export default combineReducers({
	termList,
	terms: services.terms.reducer,
	facets: services.facets.reducer,
	relations: services.relations.reducer,
	relationships: services.relationships.reducer,
	graph,
});
