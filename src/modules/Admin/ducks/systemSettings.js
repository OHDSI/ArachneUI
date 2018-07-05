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
 * Created: October 02, 2017
 *
 */

import Duck from 'services/Duck';
import { apiPaths } from 'modules/Admin/const';
import api from 'services/Api';
import {action as actionName} from 'services/CrudActionNameBuilder';

const actionCoreName = 'AD_SYS_SETTINGS';

const systemSettingsDuck = new Duck({
  name: actionCoreName,
  urlBuilder: apiPaths.systemSettings,
});

const actions = systemSettingsDuck.actions;
const reducer = systemSettingsDuck.reducer;

function pending(){
  return {
    type: actionName(actionCoreName).query().pending().toString(),
    payload: {},
  };
}

function done() {
  return {
    type: actionName(actionCoreName).query().done().toString(),
    payload: {},
  }
}

function healthCheck(resolve) {
  setTimeout(() => {
    api
      .doGet(
        apiPaths.ping(),
        () => {
          resolve();
        }
      )
      .catch(() => {
        healthCheck(resolve);
      });
  }, 1000);
}

function apply(resolve) {
  return (dispatch) => {
    dispatch(pending());
    api.doPost(apiPaths.restartServer());
    healthCheck(resolve);
  };
}

export default {
  actions,
  reducer,
};
export {
  healthCheck,
  apply,
};