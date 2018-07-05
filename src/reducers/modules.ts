/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
