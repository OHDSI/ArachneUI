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
 * Created: January 23, 2017
 *
 */

import api from 'services/Api';
import { validators } from 'services/Utils';
import { apiPaths, actionTypes, autocompleteResultsLimit } from '../const';

function recieveSkills(skills) {
  return {
    type: actionTypes.RECIEVE_SKILLS,
    payload: skills,
  };
}

function requestSkills() {
  return {
    type: actionTypes.REQUEST_SKILLS,
    payload: {},
  };
}

function getSkillsAutocomplete(query) {
  return dispatch => api.doGet(
      apiPaths.skills(query ? query.query : '', autocompleteResultsLimit),
      (res) => {
        dispatch(recieveSkills(res.result));
      }
    );
}

function createSkill(skill) {
  return (dispatch) => {
    dispatch(requestSkills());
    return api.doPost(
      apiPaths.createSkill(),
      {
        id: null,
        name: skill.value,
      },
      (res) => {
        validators.checkValidationError(res);
      }
    );
  };
}

export default {
  createSkill,
  getSkillsAutocomplete,
};
