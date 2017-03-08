import { combineReducers } from 'redux';
import services from '../apiServices';

import termList from './termList';

export default combineReducers({
	termList,
	posts: services.posts.reducer,
});
