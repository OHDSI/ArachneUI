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
 * Created: November 01, 2017
 *
 */

import { apiPaths } from 'modules/Auth/const';
import AuthService from 'services/Auth';
import api from 'services/Api';
import { action } from 'services/CrudActionNameBuilder';
import ReducerFactory from 'services/ReducerFactory';

const actionCoreName = 'AU_TOKEN';

export default {
  actions: {
    refresh: () => {
      return async dispatch => {
        const result = await api.doPost(apiPaths.refresh());
        if (result.error) {
          throw result.error;
        }
        const token = result.result;
        AuthService.setToken(token || '');
        dispatch({ type: action(actionCoreName).create().done().toString(), token });
      }
    },
  },
  reducer: new ReducerFactory()
    .setActionHandler(action(actionCoreName).create().done().toString(),
      (state, action) => ({
          ...state,
          isSaving: false,
          data: null,
      })),
};
