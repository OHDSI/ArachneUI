import ReducerFactory from 'services/ReducerFactory';
import { actionTypes } from '../const';

export default new ReducerFactory()
  .setReceiveAction(actionTypes.ALL_VOCABS_TOGGLED)
  .build();