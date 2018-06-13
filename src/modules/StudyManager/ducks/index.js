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
 * Created: August 30, 2017
 *
 */

import studyList from './studyList';
import study from './study';
import typeList from './typeList';
import analyses from './analyses';
import studyInsights from './studyInsights';
import statusList from './statusList';
import participantList from './participantList';
import analysisTypes from './analysisTypes';
import dataSourceList from './dataSourceList';
import availableTransitions from './availableTransitions';
import studyDocumentFile from './studyDocumentFile';
import studyInvitations from './studyInvitations';

const actions = {
  analyses: analyses.actions,
  analysisTypes: analysisTypes.actions,
  availableTransitions: availableTransitions.actions,
  dataSourceList: dataSourceList.actions,
  participantList: participantList.actions,
  statusList: statusList.actions,
  study: study.actions,
  studyInsights: studyInsights.actions,
  studyList: studyList.actions,
  typeList: typeList.actions,
  studyDocumentFile: studyDocumentFile.actions,
  studyInvitations: studyInvitations.actions,
};

const reducer = {
  analyses: analyses.reducer,
  analysisTypes: analysisTypes.reducer,
  availableTransitions: availableTransitions.reducer,
  dataSourceList: dataSourceList.reducer,
  participantList: participantList.reducer,
  statusList: statusList.reducer,
  study: study.reducer,
  studyInsights: studyInsights.reducer,
  studyList: studyList.reducer,
  typeList: typeList.reducer,
  studyDocumentFile: studyDocumentFile.reducer,
  studyInvitations: studyInvitations.reducer,
};

export default {
  actions,
  reducer,
};
