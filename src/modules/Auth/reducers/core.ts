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

import { actionTypes } from 'modules/Auth/const';
import { LOCATION_CHANGE } from 'react-router-redux';

function setUserToken(state, action) {
  return { ...state, token: action.token };
}

function setBackUrl(state, action) {
  return { ...state, backUrl: action.data.url };
}

export default function (state = {}, action) {
  switch (action.type) {
    case actionTypes.SET_AUTH_TOKEN:
      return setUserToken(state, action);
    case actionTypes.SET_BACK_URL:
      return setBackUrl(state, action);
    default:
      return state;
  }
}
