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
 * Created: April 12, 2017
 *
 */

import keyMirror from 'keymirror';
import { paths as commonPaths } from 'const/paths';

const apiPaths = {
  userpic: id => `/api/v1/user-management/users/${id}/avatar`,
  studyDocument: ({ studyId, fileId }) => `/api/v1/study-management/studies/${studyId}/files/${fileId}`,
};
const paths = {
  analyses: id => `/analysis-execution/analyses${id ? `/${id}` : ''}`,
  dataSources: id => `/data-catalog/data-sources${id ? `/${id}` : ''}`,
  studies: id => `/study-manager/studies${id ? `/${id}` : ''}`,
  user: commonPaths.profile,
};

const submissionStatusTitles = {
  NOT_APPROVED: () => 'rejected',
  IN_PROGRESS: () => 'approved',
  EXECUTED: isImpersonal => (isImpersonal ? 'awaiting approval' : 'awaiting approval for'),
  FAILED: isImpersonal => (isImpersonal ? 'awaiting approval' : 'awaiting approval for'),
  EXECUTED_REJECTED: () => 'rejected',
  FAILED_REJECTED: () => 'rejected',
  EXECUTED_PUBLISHED: isImpersonal => (isImpersonal ? 'published' : 'published results from'),
  FAILED_PUBLISHED: isImpersonal => (isImpersonal ? 'published' : 'published results from'),
  PENDING: isImpersonal => (isImpersonal ? 'pending' : 'updated'),
  STARTING: () => 'started',
};


const participantRoles = {
  LEAD_INVESTIGATOR: 'Lead Investigator',
  DATA_SET_OWNER: 'Data Set Owner',
  CONTRIBUTOR: 'Contributor',
};

export {
  apiPaths,
  paths,
  participantRoles,
  submissionStatusTitles,
};
