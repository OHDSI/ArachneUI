import { Action } from 'redux';
import actionTypes from 'const/actionTypes';
import { IAppAction } from 'actions';
import { IModuleMetadata } from 'actions/modules';

interface IModuleListState {
  list: IModuleMetadata[];
  active: string;
}

interface IRegisterModuleAction extends IAppAction<IModuleMetadata> {};
interface ISetActiveModuleAction extends IAppAction<string> {};

const defaultState: IModuleListState = {
  list: [],
  active: null,
};

function register(
  state: IModuleListState, action: IRegisterModuleAction
 ): IModuleListState {
  return { ...state, list: [...state.list, action.payload] };
}

function setActive(
  state: IModuleListState, action: ISetActiveModuleAction
): IModuleListState {
  return { ...state, active: action.payload };
}

export default function (
  state: IModuleListState = defaultState, action: IRegisterModuleAction | ISetActiveModuleAction
): IModuleListState {
  switch (action.type) {
    case actionTypes.MODULE_REGISTER:
      return register(state, action as IRegisterModuleAction);
    case actionTypes.MODULE_SET_ACTIVE:
      return setActive(state, action as ISetActiveModuleAction);
    default:
      return state;
  }
}

export {
  IModuleListState
};
