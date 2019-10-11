import { combineReducers } from 'redux';
import { imgs, paths } from './const';
import ducks from './ducks';

export default {
  actions: () => ducks.actions,
  reducer: () => combineReducers(ducks.reducer),
  routes: () => require('./routes').default(),
  sidebarElement: {
    ico: imgs.sidebarIco,
    name: 'Submissions',
    path: paths.submissions(),
  },
  indexRedirect: '/list',
};
