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

function requestList(state) {
  return { ...state, isLoading: true };
}

function receiveList(state, action) {
  return { ...state, list: action.payload, isLoading: false };
}

export default function (state = {}, action) {
  switch (action.type) {
    case actionTypes.REQUEST_PROFESSIONAL_TYPES:
      return requestList(state, action);
    case actionTypes.RECEIVE_PROFESSIONAL_TYPES:
      return receiveList(state, action);
    default:
      return state;
  }
}
