/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexandr Saltykov, Pavel Grafkin, Vitaly Koulakov, Anton Gackovka
 * Created: March 3, 2017
 *
 */

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