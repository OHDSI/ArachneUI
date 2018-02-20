import { combineReducers, ReducersMapObject } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import { ModalUtils } from 'arachne-ui-components';
import modulesReducer from './modules';

function createReducer(appReducers: ReducersMapObject) {
  return combineReducers({
    routing: routerReducer,
    form: formReducer,
    modal: ModalUtils.reducer,
    modules: modulesReducer,
    ...appReducers,
  });
}

export default createReducer;
