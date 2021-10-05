/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
 * Created: December 14, 2016
 *
 */

import actionTypes from 'const/actionTypes';

function register(state, action) {
  const list = state.list || [];
  return { ...state, list: [...list, action.payload] };
}

function setActive(state, action) {
  return { ...state, active: action.payload };
}

function unregisterAll(state) {
  return { ...state, list: [], active: '' };
}

function registerDisabledModules(state, action) {
  return { ...state, disabledModules: action.payload };
}

export default function (state = {}, action) {
  switch (action.type) {
    case actionTypes.MODULE_REGISTER:
      return register(state, action);
    case actionTypes.MODULE_SET_ACTIVE:
      return setActive(state, action);
    case actionTypes.MODULE_UNREGISTER_ALL:
      return unregisterAll(state);
    case actionTypes.DISABLED_MODULES_REGISTER:
      return registerDisabledModules(state, action);
    default:
      return state;
  }
}
