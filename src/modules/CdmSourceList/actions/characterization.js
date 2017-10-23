/*
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
 * Created: June 14, 2017
 *
 */

import { apiPaths, actionTypes } from 'modules/CdmSourceList/const';
import ActionFactory from 'services/ActionFactory';

const actionFactory = new ActionFactory({
  requestActionType: actionTypes.REQUEST_CDM_CHARACTERIZATION,
  receiveActionType: actionTypes.RECEIVE_CDM_CHARACTERIZATION,
  urlBuilder: apiPaths.characterization,
});

const _load = actionFactory.buildLoadActionCreator();
const load = params => _load({ ...params, limit: 2 });

const update = actionFactory.buildCreateActionCreator();

export default {
  load,
  update,
};
