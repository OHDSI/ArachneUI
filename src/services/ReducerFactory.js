/**
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: January 20, 2017
 *
 */

class ReducerFactory {

  constructor() {
    this.handlers = [];
  }

  static requestHandler(state, action) {
    return { ...state, isLoading: true, requestParams: action.payload || null };
  }

  static receiveHandler(state, action) {
    return { ...state, data: action.payload, isLoading: false };
  }

  static updatedHandler(state) {
    return { ...state, isLoading: false };
  }

  setActionHandler(actionType, handler) {
    this.handlers[actionType] = handler;
    return this;
  }

  setRequestAction(actionType) {
    this.setActionHandler(actionType, ReducerFactory.requestHandler);
    return this;
  }

  setReceiveAction(actionType) {
    this.setActionHandler(actionType, ReducerFactory.receiveHandler);
    return this;
  }

  setUpdatedAction(actionType) {
    this.setActionHandler(actionType, ReducerFactory.updatedHandler);
    return this;
  }

  build() {
    return (state = {}, action) => {
      if (Object.prototype.hasOwnProperty.call(this.handlers, action.type)) {
        return this.handlers[action.type].call(null, state, action);
      }
      return state;
    };
  }

}

export default ReducerFactory;
