import { sections } from "../const";

const actionCoreName = 'SUBMISSIONS_PANEL_MODAL_TABS';

function set(options) {
  return {
    type: actionCoreName,
    payload: options,
  };
}

function reducer(state = { activeTab: sections.FILES }, action) {
  switch (action.type) {
    case actionCoreName:
      return {
        ...state,
        activeTab: action.payload,
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