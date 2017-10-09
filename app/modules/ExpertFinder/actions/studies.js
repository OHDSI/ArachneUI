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
 * Created: January 26, 2017
 *
 */

import { apiPaths, actionTypes } from 'modules/ExpertFinder/const';
import { validators } from 'services/Utils';
import { SubmissionError } from 'redux-form';
import api from 'services/Api';

function recieveStudies(studies) {
  return {
    type: actionTypes.RECIEVE_STUDIES,
    payload: studies,
  };
}

function getStudiesAutocomplete({ query, participantId }) {
  return dispatch => api.doGet(
    apiPaths.studiesAutocomplete({ query, participantId }),
    res => dispatch(recieveStudies(res.result))
  );
}

function inviteParticipant(userId, studyId, role) {
  return () => {
    if (isNaN(studyId)) {
      throw new SubmissionError({
        _error: 'You should select the study',
      });
    }
    return api.doPost(
      apiPaths.inviteParticipant(studyId),
      {
        userId,
        role,
      },
      (res) => {
        validators.checkValidationError(res);
      },
    );
  };
}

export default {
  getStudiesAutocomplete,
  inviteParticipant,
};
