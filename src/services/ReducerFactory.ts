import { IAppAction } from 'actions';

interface IAppState {
  data: any;
  isLoading: boolean;
}

const defaultState: IAppState = {
  data: null,
  isLoading: false,
};

class ReducerFactory {
  handlers: {
    [key: string]: Function
  };

  constructor() {
    this.handlers = {};
  }

  static requestHandler(state: IAppState = defaultState): IAppState {
    return { ...state, isLoading: true };
  }

  static receiveHandler(
    state: IAppState = defaultState,
    action: IAppAction<any>
  ): IAppState {
    return { ...state, data: action.payload, isLoading: false };
  }

  static updatedHandler(state: IAppState = defaultState): IAppState {
    return { ...state, isLoading: false };
  }

  setActionHandler(actionType: string, handler: Function) {
    this.handlers[actionType] = handler;
    return this;
  }

  setRequestAction(actionType: string) {
    this.setActionHandler(actionType, ReducerFactory.requestHandler);
    return this;
  }

  setReceiveAction(actionType: string) {
    this.setActionHandler(actionType, ReducerFactory.receiveHandler);
    return this;
  }

  setUpdatedAction(actionType: string) {
    this.setActionHandler(actionType, ReducerFactory.updatedHandler);
    return this;
  }

  build() {
    return (state: IAppState = defaultState, action: IAppAction<any>) => {
      if (Object.prototype.hasOwnProperty.call(this.handlers, action.type)) {
        return this.handlers[action.type].call(null, state, action);
      }
      return state;
    };
  }

}

export default ReducerFactory;