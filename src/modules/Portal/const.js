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
 * Created: December 13, 2016
 *
 */

import keyMirror from 'keymirror';

const form = keyMirror({
  changePassword: null,
  rejectInvitation: null,
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
};

const paths = {
  study: id => `/study-manager/studies/${id}`,
  userProfile: id => `/expert-finder/profile/${id}`,
  odysseus: () => 'http://odysseusinc.com/',
};

const inviteActionTypes = keyMirror({
  success: null,
  cancel: null,
});

const pollingTime = 10000;

const images = {
  logo: '/img/icons/Universal_Desktop/Header/logo_odys.svg',
};

export {
  apiPaths,
  form,
  modal,
  paths,
  inviteActionTypes,
  pollingTime,
  images,
};
