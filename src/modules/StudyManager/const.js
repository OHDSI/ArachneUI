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
import { Utils } from 'services/Utils';

const modal = keyMirror({
  createStudy: null,
  addParticipant: null,
  addDataSource: null,
  createAnalysis: null,
  createDocument: null,
  editStudyTitle: null,
  confirmParticipant: null,
  confirmDatasource: null,
  modalStudyProperties: null,
  participantsList: null,
});

const form = keyMirror({
  createStudy: null,
  addParticipant: null,
  addCatalogSource: null,
  addVirtualSource: null,
  createAnalysis: null,
  editStudyTitle: null,
  createDocumentFiles: null,
  createDocumentLinks: null,
});

const paths = {
  analyses: id => `/analysis-execution/analyses${id ? `/${id}` : ''}`,
  dataSources: id => `/data-catalog/data-sources${id ? `/${id}` : ''}`,
  studies: id => `/study-manager/studies${id ? `/${id}` : ''}`,
  user: id => `/expert-finder/profile/${id}`,
  studyFile: ({ studyId, fileId }) => `/study-manager/studies/${studyId}/documents/${fileId}`,
};

const apiPaths = {
  // Study
  studies: id => `/api/v1/study-management/studies${id ? `/${id}` : ''}`,
  studyInsights: ({ studyId }) => `/api/v1/study-management/studies/${studyId}/insights`,
  // Study invitations
  studyInvitations: ({ studyId }) => `/api/v1/user-management/users/invitations?studyId=${studyId}`,
  // Study types
  studyTypes: () => '/api/v1/study-management/study-types',
  // Study statuses
  studyStatuses: () => '/api/v1/study-management/study-statuses',
  availableTransitions: ({ studyId }) => `/api/v1/study-management/studies/${studyId}/available-state-transitions`,
  // Analyses
  analyses: id => `/api/v1/analysis-management/analyses${id ? `/${id}` : ''}`,
  analysisTypes: () => '/api/v1/analysis-management/analyses/types',
  moveAnalysis: () => '/api/v1/study-management/move-analysis',
  // Participants
  searchUser: () => '/api/v1/user-management/users/search-user',
  studyParticipants: ({ studyId, userId }) => `/api/v1/study-management/studies/${studyId}/participants${userId ? `/${userId}` : ''}`,
  // Documents
  uploadStudyDocument: ({ studyId }) => `/api/v1/study-management/studies/${studyId}/upload`,
  studyDocument: ({ studyId, fileUuid, query }) => Utils.setUrlParams(`/api/v1/study-management/studies/${studyId}/files/${fileUuid}`, query),
  studyDocumentDownload: ({ studyId, fileUuid }) => `/api/v1/study-management/studies/${studyId}/files/${fileUuid}/download`,
  studyDocumentDownloadAll: ({ studyId }) => `/api/v1/study-management/studies/${studyId}/files/all/download`,

  // Data Sources
  searchDataSource: () => '/api/v1/data-sources/search-data-source',
  studyDataSources: ({ studyId, dataSourceId }) => `/api/v1/study-management/studies/${studyId}/data-sources${dataSourceId ? `/${dataSourceId}` : ''}`,
  removeStudy: id => `/api/v1/admin/studies/${id}`,
  userpic: id => `/api/v1/user-management/users/${id}/avatar`,
  setFavourite: studyId => `/api/v1/study-management/studies/${studyId}/favourite`,
};

const statusColors = {
  active: 'green',
  published: 'blue',
  completed: 'purple',
  initiate: 'orange',
  archived: 'grey',
};

const imgs = {
  sidebarIco: '/img/icons/Universal_Desktop/Navigation/Arachne_Desktop_icon-Studies_Library.png',
};

const studyListPageSize = 12;
const studyListPageSizeCards = 8;

const studyPermissions = {
  accessStudy: 'ACCESS_STUDY',
  createAnalysis: 'CREATE_ANALYSIS',
  editStudy: 'EDIT_STUDY',
  inviteContributor: 'INVITE_CONTRIBUTOR',
  inviteDatanode: 'INVITE_DATANODE',
  uploadFiles: 'UPLOAD_FILES',
  unlinkDatasource: 'UNLINK_DATASOURCE',
};

const studyActions = {
  createPaper: 'CREATE_PAPER',
  publishPaper: 'PUBLISH_PAPER',
};

const submissionStatusTitles = {
  NOT_APPROVED: 'rejected',
  IN_PROGRESS: 'approved',
  EXECUTED: 'awaiting approval for',
  FAILED: 'awaiting approval for',
  EXECUTED_REJECTED: 'rejected',
  FAILED_REJECTED: 'rejected',
  EXECUTED_PUBLISHED: 'published results from',
  FAILED_PUBLISHED: 'published results from',
};

const recentActivityPageSize = 10;

const participantRoles = keyMirror({
  LEAD_INVESTIGATOR: null,
  DATA_SET_OWNER: null,
  CONTRIBUTOR: null,
});


const participantStatuses = keyMirror({
  DELETED: null,
  APPROVED: null,
  PENDING: null,
  DECLINED: null
});

const newParticipantRolesOptions = [
  {
    label: 'Lead Investigator',
    value: participantRoles.LEAD_INVESTIGATOR,
  },
  {
    label: 'Contributor',
    value: participantRoles.CONTRIBUTOR,
  },
];

const dataSourceStatuses = {
  DELETED: 'Deleted',
};

export {
  modal,
  form,
  paths,
  apiPaths,
  dataSourceStatuses,
  imgs,
  participantRoles,
  newParticipantRolesOptions,
  participantStatuses,
  statusColors,
  studyListPageSize,
  studyListPageSizeCards,
  studyPermissions,
  studyActions,
  recentActivityPageSize,
  submissionStatusTitles,
};
