import ReducerFactory from 'services/ReducerFactory';
import { actionTypes } from '../const';

export default new ReducerFactory()
  .setRequestAction(actionTypes.GRAPH_RENDER_STARTED)
  .setReceiveAction(actionTypes.GRAPH_RENDER_FINISHED)
  .build();