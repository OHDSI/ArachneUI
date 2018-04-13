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

import API from 'services/Api';
import services from '../apiServices';

import { actionTypes } from 'modules/SearchTerms/const';
import { IAppAction } from 'actions';

function setLoadingFinished(): IAppAction<{}> {
  return {
    type: actionTypes.GRAPH_RENDER_FINISHED,
    payload: {},
  };
}

function setLoadingStarted(): IAppAction<{}> {
  return {
    type: actionTypes.GRAPH_RENDER_STARTED,
    payload: {},
  };
}

function setLoadingStatus(status: boolean) {
  return status === true ? setLoadingStarted() : setLoadingFinished();
}

export default {
  setLoadingStatus,
};

