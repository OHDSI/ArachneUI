import { Action } from 'redux';
import { IAppAction } from 'actions';

interface ITermListState {
  firedAction: string;
}

const defaultState: ITermListState = {
  firedAction: null,
};

export default function (
  state: any = defaultState, action: IAppAction<string>
): ITermListState {
  switch (action.type) {
    case 'TEST_ACTION':
      return { ...state, firedAction: action.payload };
    default:
      return state;
  }
}

export {
  ITermListState
};
