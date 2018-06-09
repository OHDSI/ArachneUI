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
 * Created: September 05, 2017
 *
 */

import Duck from 'services/Duck';
import { Utils } from 'services/Utils';
import { apiPaths, studyKind } from 'modules/StudyManager/const';
import { apiPaths as paperApiPaths } from 'modules/InsightsLibrary/const';
import { apiPaths as workspacePaths } from 'modules/Workspace/const';

const studiesCoreName = 'SM_STUDY';
const paperCoreName = 'SM_STUDY_PAPER';
const documentCoreName = 'SM_STUDY_DOCUMENT';
const participantsCoreName = 'SM_STUDY_PARTICIPANTS';
const dsCoreName = 'SM_STUDY_DATA_SOURCE';
const analysisMoveCoreName = 'SM_ANALYSIS_MOVE';

const ducks = new Duck({
  name: studiesCoreName,
  urlBuilder: ({ id, kind = studyKind.REGULAR }) => {
    return kind === studyKind.WORKSPACE ? workspacePaths.workspace({ id }) : apiPaths.studies({ id });
  }
});

const paperDuck = new Duck({
  name: paperCoreName,
  urlBuilder: paperApiPaths.insights,
});

const documentDuck = new Duck({
  name: documentCoreName,
  urlBuilder: (params) => {
    if (params.action === 'remove') {
      return apiPaths.studyDocument(params);
    }
    return apiPaths.uploadStudyDocument(params);
  },
});

const participantsDuck = new Duck({
  name: participantsCoreName,
  urlBuilder: apiPaths.studyParticipants,
});

const datasourceDuck = new Duck({
  name: dsCoreName,
  urlBuilder: apiPaths.studyDataSources,
});

const analysisMoveDuck = new Duck({
  name: analysisMoveCoreName,
  urlBuilder: apiPaths.moveAnalysis,
});

function unloadDataSource() {
  return dispatch => dispatch({
    type: 'SM_STUDY_DATA_SOURCE_FIND_FULFILLED',
    payload: null,
  });
}

export default {
  actions: {
    ...ducks.actions,
    paper: paperDuck.actions,
    document: documentDuck.actions,
    participants: participantsDuck.actions,
    dataSource: {...datasourceDuck.actions, unload: unloadDataSource},
    analysisMove: analysisMoveDuck.actions,
  },
  reducer: Utils.extendReducer(ducks.reducer, {
    paper: paperDuck.reducer,
    document: documentDuck.reducer,
    participants: participantsDuck.reducer,
    dataSource: datasourceDuck.reducer,
    analysisMove: analysisMoveDuck.reducer,
  }),
};
