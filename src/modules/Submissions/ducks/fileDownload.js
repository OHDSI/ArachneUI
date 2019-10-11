const actionCoreName = 'SUBMISSIONS_PANEL_DOWNLOAD_RESULTS_QUEUE';
const addToQueueActionName = `${actionCoreName}_ADD`;
const removeFromQueueActionName = `${actionCoreName}_REMOVE`;

function addToQueue(id) {
  return {
    type: addToQueueActionName,
    payload: id,
  };
}

function removeFromQueue(id) {
  return {
    type: removeFromQueueActionName,
    payload: id,
  };
}

function reducer(state = { ids: [] }, action) {
  switch (action.type) {
    case addToQueueActionName:
      return {
        ...state,
        ids: state.ids.concat(action.payload),
      };
    case removeFromQueueActionName:
      return {
        ...state,
        ids: state.ids.filter(id => id !== action.payload),
      };
    default:
      return state;
  }
}

const actions = { addToQueue, removeFromQueue };

export default {
  actions,
  reducer,
};