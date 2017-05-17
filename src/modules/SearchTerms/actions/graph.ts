import API from 'services/Api';
import services from '../apiServices';

import { actionTypes } from 'modules/SearchTerms/const';
import { IAppAction } from 'actions';

function setLoadingFinished(): IAppAction<{}> {
  return {
    type: actionTypes.GRAPH_RENDER_FINISHED,
    payload: {},
  };
}

function setLoadingStarted(): IAppAction<{}> {
  return {
    type: actionTypes.GRAPH_RENDER_STARTED,
    payload: {},
  };
}

function setLoadingStatus(status: boolean) {
  return status === true ? setLoadingStarted() : setLoadingFinished();
}

export default {
  setLoadingStatus,
};

