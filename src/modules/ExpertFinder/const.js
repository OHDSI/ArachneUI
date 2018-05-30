/*
 *
 * Copyright 2018 Observational Health Data Sciences and Informatics
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

import keyMirror from 'keymirror';
import { types as fieldTypes } from 'const/modelAttributes';
import URI from 'urijs';

const submitBtnConfig = {
  label: 'Add',
  loadingLabel: 'Adding',
  mods: ['success'],
};

const modalSubmitBtnConfig = {
  label: 'Upload',
  loadingLabel: 'Uploading',
  mods: ['success', 'rounded'],
};

const cancelBtnConfig = {
  label: 'Cancel',
  mods: ['cancel'],
};

const forms = keyMirror({
  filter: null,
  general: null,
  contactInfo: null,
  links: null,
  publications: null,
  skills: null,
  summary: null,
  userPic: null,
  invite: null,
  nameEdit: null,
});

const modal = keyMirror({
  userPic: null,
  invite: null,
  inviteConfirm: null,
  nameEdit: null,
});

const autocompleteResultsLimit = 10;
const maxDescriptionLength = 1024;

const apiPaths = {
  userSkill: ({ id }) => `/api/v1/user-management/users/skills${id ? `/${id}` : ''}`,
  userPublication: ({ id } = {}) => `/api/v1/user-management/users/publications${id ? `/${id}` : ''}`,
  userLink: ({ id } = {}) => `/api/v1/user-management/users/links${id ? `/${id}` : ''}`,
  professionalTypes: () => '/api/v1/user-management/professional-types',
  skills: ({ query, limit = 10 } = {}) => {
    const baseUrl = '/api/v1/user-management/skills';
    let url = new URI(baseUrl);
    if (query) {
      url = new URI(`${baseUrl}/search`);
      url.setSearch({
        query,
        limit,
      });
    }
    return url.href();
  },
  updateUserProfile: () => '/api/v1/user-management/users/profile',
  userpic: ({ id, hash }) => `/api/v1/user-management/users/${id}/avatar${hash ? `?${hash}` : ''}`,
  userProfile: ({ id }) => `/api/v1/user-management/users/${id}/profile`,
  myUserpic: ({ hash }) => `/api/v1/user-management/users/avatar${hash ? `?${hash}` : ''}`,
  inviteParticipant: ({ studyId }) =>
    `/api/v1/study-management/studies/${studyId}/participants`,
  studies: ({ query, participantId }) =>
    `/api/v1/study-management/studies?region=PARTICIPANT&participantId=${participantId}&query=${query}`,
  expertList: ({ searchStr } = {}) => `/api/v1/user-management/users${searchStr ? searchStr : ''}`,
  searchCountry: ({ query, includeId } = {}) =>
    `/api/v1/user-management/countries/search?limit=${autocompleteResultsLimit}&query=${query}${includeId ? `&includeId=${includeId}` : ''}`,
  searchProvince: ({ countryId, query, includeId } = {}) =>
    `/api/v1/user-management/state-province/search?limit=${autocompleteResultsLimit}&query=${query}&countryId=${countryId}${includeId ? `&includeId=${includeId}` : ''}`,
  studiesAutocomplete: ({ query, participantId }) =>
    `/api/v1/study-management/studies/search?region=PARTICIPANT&id=${participantId}&query=${query}`,
};

const paths = {
  profile: id => `/expert-finder/profile/${id}`,
  list: () => '/expert-finder/list',
  settings: () => '/portal/settings',
  study: id => `/study-manager/studies/${id}`,
  logout: () => '/auth/logout',
  datasources: () => '/data-catalog/my-data-sources',
};

const roles = {
  LEAD_INVESTIGATOR: {
    label: 'Lead investigator',
    value: 'LEAD_INVESTIGATOR',
  },
  CONTRIBUTOR: {
    label: 'Contributor',
    value: 'CONTRIBUTOR',
  },
};

export {
  apiPaths,
  cancelBtnConfig,
  fieldTypes,
  forms,
  modal,
  modalSubmitBtnConfig,
  submitBtnConfig,
  paths,
  autocompleteResultsLimit,
  maxDescriptionLength,
  roles,
};
