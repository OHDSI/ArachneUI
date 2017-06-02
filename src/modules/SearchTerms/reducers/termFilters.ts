import ReducerFactory from 'services/ReducerFactory';
import { actionTypes } from '../const';

export default new ReducerFactory()
  .setReceiveAction(actionTypes.SET_TERM_FILTERS)
  .build();