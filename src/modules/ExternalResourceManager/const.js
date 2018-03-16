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
 * Authors: Pavel Grafkin
 * Created: March 14, 2018
 *
 */

import keyMirror from 'keymirror';

const modal = keyMirror({
  atlasDetails: null,
});

const form = keyMirror({
  atlasDetails: null,
});

const paths = {
  atlases: () => '/external-resource-manager/atlases',
};

const apiPaths = {
  atlases: ({ id } = {}) => `/api/v1/atlases${id ? `/${id}` : ''}`,
  atlasConnection: ({ id }) => `/api/v1/admin/atlases/${id}/connection`,
};

const imgs = {
  sidebarIco: '/img/icons/Universal_Desktop/Navigation/Arachne_Desktop_icon-Data_Catalog.png',
};

const atlasAuthTypeList = {
  none: {
    label: 'None',
    value: 'NONE',
  },
  database: {
    label: 'Database',
    value: 'DATABASE',
  },
  ldap: {
    label: 'LDAP',
    value: 'LDAP',
  },
};

export {
  apiPaths,
  atlasAuthTypeList,
  form,
  imgs,
  modal,
  paths,
};
