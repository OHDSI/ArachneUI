/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
 * Created: December 13, 2016
 *
 */

import keyMirror from 'keymirror';
import types from 'const/modelAttributes';
import { paths as commonPaths } from 'const/paths';

const form = keyMirror({
  changePassword: null,
  rejectInvitation: null,
  search: null,
});

const modal = keyMirror({
  portalAboutInfo: null,
  rejectInvitation: null,
});

const apiPaths = {
  buildNumber: () => '/api/v1/build-number',
  changePassword: () => '/api/v1/user-management/users/changepassword',
  invitations: () => '/api/v1/user-management/users/invitations',
  invitationsSubscription: () => '/user/topic/invitations',
  userpic: id => `/api/v1/user-management/users/${id}/avatar`,
  search: () => '/api/v1/search',
  myProfile: () => '/api/v1/auth/me',
  userSettings: () => `/api/v1/user-management/users/settings`,
};

const paths = {
  study: id => `/study-manager/studies/${id}`,
  userProfile: commonPaths.profile,
  odysseus: () => 'http://odysseusinc.com/',
  search: ({ query }) => `/portal/search?query=${query}`,
};

const inviteActionTypes = keyMirror({
  success: null,
  cancel: null,
});

const pollingTime = 10000;

const images = {
  logo: '/img/icons/Universal_Desktop/Header/logo_odys.svg',
};

const domains = keyMirror({
  ANALYSIS: null,
  STUDY: null,
  USER: null,
  DATA_SOURCE: null,
  PAPER: null,
  INSIGHT: null,
  STUDY_FILE: null,
  SUBMISSION: null,
  SUBMISSION_GROUP: null,
});

const domainNames = {
  [domains.STUDY]: 'Study notebook',
  [domains.USER]: 'Expert finder',
  [domains.DATA_SOURCE]: 'Data catalog',
  [domains.PAPER]: 'Insights library',
  [domains.ANALYSIS]: 'Analyses',
};

const searchSections = [
  {
    label: 'Domain',
    name: 'collections',
    type: types.enumMulti,
    forceOpened: true,
    hasTitle: false,
    options: [
      {
        label: domainNames.STUDY,
        value: domains.STUDY,
      },
      {
        label: domainNames.USER,
        value: domains.USER,
      },
      {
        label: domainNames.DATA_SOURCE,
        value: domains.DATA_SOURCE,
      },
      {
        label: domainNames.ANALYSIS,
        value: domains.ANALYSIS,
      },
      {
        label: domainNames.PAPER,
        value: domains.PAPER,
      },
    ],
  },
];

const searchResultsPageSize = 10;
const detectorRegexp = /\[b\]([^\[]*)\[\/b\]/g;

export {
  apiPaths,
  form,
  modal,
  paths,
  inviteActionTypes,
  pollingTime,
  images,
  searchSections,
  searchResultsPageSize,
  domains,
  domainNames,
  detectorRegexp,
};
