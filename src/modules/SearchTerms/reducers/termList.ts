import ReducerFactory from 'services/ReducerFactory';
import { actionTypes } from '../const';

export default new ReducerFactory()
  .setReceiveAction(actionTypes.SEARCH_PAGE_SIZE_UPDATED)
  .build();