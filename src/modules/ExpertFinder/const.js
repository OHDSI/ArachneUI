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
 * Created: January 16, 2017
 *
 */

import keyMirror from 'keymirror';
import { types as fieldTypes } from 'const/modelAttributes';

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

const actionTypes = keyMirror({
  REQUEST_EXPERTS_LIST: null,
  RECIEVE_EXPERTS_LIST: null,
  RECIEVE_EL_FACETS: null,
  REQUEST_DYNAMIC_SECTIONS: null,
  RECIEVE_DYNAMIC_SECTIONS: null,
  REQUEST_PROFESSIONAL_TYPES: null,
  RECIEVE_PROFESSIONAL_TYPES: null,
  REQUEST_SKILLS: null,
  RECIEVE_SKILLS: null,
  REQUEST_USER_PROFILE: null,
  RECIEVE_USER_PROFILE: null,
  RECIEVE_MY_PROFILE: null,
  RECIEVE_STUDIES: null,
  INVITE_PARTICIPANT: null,
  REQUEST_EF_COUNTRIES: null,
  RECIEVE_EF_COUNTRIES: null,
  REQUEST_EF_PROVINCES: null,
  RECIEVE_EF_PROVINCES: null,
});

const modal = keyMirror({
  userPic: null,
  invite: null,
  inviteConfirm: null,
  nameEdit: null,
});

const apiPaths = {
  addSkill: id => `/api/v1/user-management/users/skills/${id}`,
  addPublication: () => '/api/v1/user-management/users/publications',
  addLink: () => '/api/v1/user-management/users/links',
  createSkill: () => '/api/v1/user-management/skills',
  removeSkill: id => `/api/v1/user-management/users/skills/${id}`,
  removePublication: id => `/api/v1/user-management/users/publications/${id}`,
  removeLink: id => `/api/v1/user-management/users/links/${id}`,
  professionalTypes: () => '/api/v1/user-management/professional-types',
  skills: (q, limit) => `/api/v1/user-management/skills?query=${q}&limit=${limit}`,
  updateUserProfile: () => '/api/v1/user-management/users/profile',
  userpic: (id, hash) => `/api/v1/user-management/users/${id}/avatar${hash ? `?${hash}` : ''}`,
  userProfile: id => `/api/v1/user-management/users/${id}/profile`,
  updateUserpic: () => '/api/v1/user-management/users/avatar/',
  myUserpic: hash => `/api/v1/user-management/users/avatar/${hash ? `?${hash}` : ''}`,
  myProfile: () => '/api/v1/auth/me',
  inviteParticipant: studyId =>
    `/api/v1/study-management/studies/${studyId}/participants`,
  studies: ({ query, participantId }) =>
    `/api/v1/study-management/studies?region=PARTICIPANT&participantId=${participantId}&query=${query}`,
  expertList: () => '/api/v1/user-management/users',
  searchCountry: () => '/api/v1/user-management/countries/search',
  searchProvince: () => '/api/v1/user-management/state-province/search',
  studiesAutocomplete: ({ query, participantId }) =>
    `/api/v1/study-management/studies/search?region=PARTICIPANT&id=${participantId}&query=${query}`,
};

const paths = {
  profile: id => `/expert-finder/profile/${id}`,
  list: () => '/expert-finder/list',
  settings: () => '/portal/settings',
  study: id => `/study-manager/studies/${id}`,
  logout: () => '/auth/logout',
};

const autocompleteResultsLimit = 10;
const maxDescriptionLength = 1024;

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
  actionTypes,
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
