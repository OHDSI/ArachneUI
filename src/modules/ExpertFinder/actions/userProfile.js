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
 * Created: January 16, 2017
 *
 */

import api from 'services/Api';
import { validators } from 'services/Utils';
import { apiPaths, actionTypes } from '../const';

function requestInfo() {
  return {
    type: actionTypes.REQUEST_USER_PROFILE,
    payload: {},
  };
}

function recieveInfo(info, hash) {
  return {
    type: actionTypes.RECIEVE_USER_PROFILE,
    payload: { ...info, hash },
  };
}

function loadInfo(userId, hash) {
  return (dispatch) => {
    dispatch(requestInfo());
    return api.doGet(
      apiPaths.userProfile(userId),
      res => dispatch(recieveInfo(res.result, hash))
    );
  };
}

function updateGeneralInfo(rawData) {
  const data = { ...rawData };

  if (rawData.professionalType) {
    data.professionalType = {
      id: rawData.professionalType,
    };
  }

  if (rawData.country) {
    data.country = {
      id: rawData.country,
    };
  }

  if (rawData.stateProvince) {
    data.stateProvince = {
      id: rawData.stateProvince,
    };
  }

  return () =>
    api.doPost(
      apiPaths.updateUserProfile(),
      data,
      (res) => {
        validators.checkValidationError(res);
      }
    );
}

function updateName({ firstname, middlename, lastname }) {
  return () =>
    api.doPost(
      apiPaths.updateUserProfile(),
      {
        firstname,
        middlename,
        lastname,
      },
      (res) => {
        validators.checkValidationError(res);
      }
    );
}

function updateSummary(text) {
  return () =>
    api.doPost(
      apiPaths.updateUserProfile(),
      {
        personalSummary: text,
      },
      (res) => {
        validators.checkValidationError(res);
      }
    );
}

function updateUserpic(image) {
  const data = new FormData();
  data.append('file', image);

  return () => api.doPost(
    apiPaths.updateUserpic(),
    data,
    (res) => {
      validators.checkValidationError(res);
    },
  );
}

function addLink(link) {
  return () => api.doPost(
    apiPaths.addLink(),
    {
      description: link.description,
      title: link.title,
      url: link.url,
    },
    (res) => {
      validators.checkValidationError(res);
    }
  );
}

function addPublication({
  title,
  publisher,
  date,
  url,
  description,
}) {
  return () =>
    api.doPost(
      apiPaths.addPublication(),
      {
        title,
        publisher,
        date,
        url,
        description,
      },
      (res) => {
        validators.checkValidationError(res);
      }
    );
}

function addSkill(skillId) {
  return () => api.doPost(
    apiPaths.addSkill(skillId),
      (res) => {
        validators.checkValidationError(res);
      }
    );
}

function removeLink(linkId) {
  return () =>
    api.doDelete(
      apiPaths.removeLink(linkId),
      (res) => {
        validators.checkValidationError(res);
      }
    );
}

function removePublication(publicationId) {
  return () =>
    api.doDelete(
      apiPaths.removePublication(publicationId),
      (res) => {
        validators.checkValidationError(res);
      }
    );
}

function removeSkill(skillId) {
  return () =>
    api.doDelete(
      apiPaths.removeSkill(skillId),
      (res) => {
        validators.checkValidationError(res);
      }
    );
}

export default {
  addLink,
  addPublication,
  addSkill,
  loadInfo,
  removeLink,
  removePublication,
  removeSkill,
  updateGeneralInfo,
  updateUserpic,
  updateSummary,
  updateName,
};
