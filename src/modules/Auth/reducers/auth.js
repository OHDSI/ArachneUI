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
 * Created: December 14, 2016
 *
 */

import { actionTypes } from 'modules/Auth/const';
import { isAuthModulePath } from 'modules/Auth/utils';
import { LOCATION_CHANGE } from 'react-router-redux';

/**
 * Remembers last page to go back after auth.
 */
function setBackUrl(state, action) {
  let newState = state;

  if (!isAuthModulePath(action.payload.pathname)) {
    newState = { ...state, backUrl: action.payload.pathname };
  }

  return newState;
}

function requestEmail(state) {
  return { ...state, isLoading: true };
}

function receiveEmail(state) {
  return { ...state, isLoading: false };
}

function receiveMethod(state, action) {
  return { ...state, method: action.payload };
}

export default function (state = {}, action) {
  switch (action.type) {
    case LOCATION_CHANGE:
      return setBackUrl(state, action);
    case actionTypes.AUTH_REQUEST_EMAIL:
      return requestEmail(state, action);
    case actionTypes.AUTH_RECEIVE_EMAIL:
      return receiveEmail(state, action);
    case actionTypes.AUTH_RECEIVE_METHOD:
      return receiveMethod(state, action);
    default:
      return state;
  }
}
