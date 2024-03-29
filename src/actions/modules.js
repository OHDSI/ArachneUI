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

function register(module) {
  return {
    type: actionTypes.MODULE_REGISTER,
    payload: module,
  };
}

function setActive(module) {
  return {
    type: actionTypes.MODULE_SET_ACTIVE,
    payload: module,
  };
}

function unregisterAll() {
  return {
    type: actionTypes.MODULE_UNREGISTER_ALL,
    payload: {},
  };
}

function registerDisabledModules(modules) {
  return {
    type: actionTypes.DISABLED_MODULES_REGISTER,
    payload: modules,
  };
}

export default {
  register,
  setActive,
  unregisterAll,
  registerDisabledModules,
};
