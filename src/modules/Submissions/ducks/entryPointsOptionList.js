const actionCoreName = 'SUBMISSIONS_PANEL_ENTRY_POINTS_OPTION_LIST';

function set(options) {
  return {
    type: actionCoreName,
    payload: options,
  };
}

function reducer(state = {}, action) {
  switch (action.type) {
    case actionCoreName:
      return {
        ...state,
        options: action.payload,
      };
    default:
      return state;
  }
}

const actions = { set };

export default {
  actions,
  reducer,
};