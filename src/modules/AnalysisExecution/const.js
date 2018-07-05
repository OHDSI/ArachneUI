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
import { Utils } from 'services/Utils';
import { paths as commonPaths } from 'const/paths';

const modal = keyMirror({
  analysisFiles: null,
  confirmDialog: null,
  createCode: null,
  createInsight: null,
  editAnalysisTitle: null,
  editInsightTitle: null,
  requestUnlock: null,
  statusHistory: null,
  submitCode: null,
  uploadResult: null,
  rejectSubmission: null,
  submissionsTableFilter: null,
  modalError: null,
  editFileName: null,
});

const form = keyMirror({
  analysisDescr: null,
  createCodeFiles: null,
  createCodeLinks: null,
  createInsight: null,
  editAnalysisTitle: null,
  editCode: null,
  editInsightTitle: null,
  insightDescr: null,
  newInsightComment: null,
  requestUnlock: null,
  submitCode: null,
  uploadResult: null,
  importNodeSelector: null,
  importCodeList: null,
  rejectSubmission: null,
  submissionsTableFilter: null,
  editFileName: null,
});

const paths = {
  studies: id => `/study-manager/studies${id ? `/${id}` : ''}`,
  analyses: id => `/analysis-execution/analyses${id ? `/${id}` : ''}`,
  analysisCode: ({ analysisId, codeFileId }) => `/analysis-execution/analyses/${analysisId}/code/${codeFileId}`,
  submissionCodeFile: ({ submissionGroupId, fileId }) => `/analysis-execution/submission-groups/${submissionGroupId}/code/${fileId}`,
  submissionResultFile: ({ submissionId, fileId }) => `/analysis-execution/submissions/${submissionId}/results/${fileId}`,
  submissionResultSummary: ({ submissionId }) => `/analysis-execution/submissions/${submissionId}/results`,
  insightCodeFile: ({ submissionId, fileId }) => `/analysis-execution/submissions/${submissionId}/insight/code/${fileId}`,
  insightResultFile: ({ submissionId, fileId }) => `/analysis-execution/submissions/${submissionId}/insight/results/${fileId}`,
  insight: ({ submissionId }) => `/analysis-execution/submissions/${submissionId}/insight`,
  profile: commonPaths.profile,
};

function importEntityPathByType(type) {
  switch (type) {
    case 'COHORT': return 'cohorts';
    case 'COHORT_CHARACTERIZATION': return 'cohorts';
    case 'ESTIMATION': return 'estimations';
    case 'PREDICTION': return 'predictions';
    case 'INCIDENCE': return 'incidence-rates';
    default: return '';
  }
}

const apiPaths = {
  analyses: ({ id }) => `/api/v1/analysis-management/analyses${id ? `/${id}` : ''}`,
  analysisTypes: () => '/api/v1/analysis-management/analyses/types',
  analysisCode: ({ analysisId, analysisCodeId, withContent = false }) => {
    let url = `/api/v1/analysis-management/analyses/${analysisId}/code-files`;
    if (analysisCodeId) {
      url += `/${analysisCodeId}?withContent=${withContent}`;
    }
    return url;
  },
  uploadAnalysisCode: ({ analysisId }) => `/api/v1/analysis-management/analyses/${analysisId}/upload`,
  analysisCodeBundle: ({ analysisId, fileUuid }) => `/api/v1/analysis-management/analyses/${analysisId}/packrat-list/${fileUuid}`,
  analysisCodeDownload: ({ analysisId, analysisCodeId }) => `/api/v1/analysis-management/analyses/${analysisId}/code-files/${analysisCodeId}/download`,
  analysisCodeDownloadAll: ({ analysisId }) => `/api/v1/analysis-management/analyses/${analysisId}/code-files/all`,
  analysisCodeLock: ({ analysisId }) => `/api/v1/analysis-management/analyses/${analysisId}/lock`,
  analysisRequestCodeUnlock: ({ analysisId }) => `/api/v1/analysis-management/analyses/${analysisId}/unlock-request`,
  breadcrumbs: ({ entityType, id }) => `/api/v1/utils/breadcrumbs/${entityType.toUpperCase()}/${id}`,
  importOptionList: ({ type, dataNodeId }) =>
    `/api/v1/data-nodes/${dataNodeId}/${importEntityPathByType(type)}`,
  entities: ({ analysisId, fileId, type }) =>
    `/api/v1/analysis-management/analyses/${analysisId}/entities${fileId ? `/${fileId}` : ''}${type ? `?type=${type}` : ''}`,
  comments: ({ commentTopicId, commentId }) => `/api/v1/comments/${commentTopicId}${commentId ? `/${commentId}` : ''}`,
  insight: ({ submissionId }) => `/api/v1/analysis-management/submissions/${submissionId}/insight`,
  statusHistory: ({ submissionId }) => `/api/v1/analysis-management/submissions/${submissionId}/status-history`,
  studyDataSources: ({ studyId }) => `/api/v1/study-management/studies/${studyId}/data-sources/`,
  submissionById: ({ submissionId }) => `/api/v1/analysis-management/submissions${submissionId ? `/${submissionId}` : ''}`,
  submissionExecute: ({ submissionId }) => `/api/v1/analysis-management/submissions/${submissionId}/approve`,
  submissionPublish: ({ submissionId }) => `/api/v1/analysis-management/submissions/${submissionId}/approveresult`,
  submissionGroupCode: ({ submissionGroupId, fileId, downloadFile, query }) => Utils.setUrlParams(`/api/v1/analysis-management/submission-groups/${submissionGroupId}/files/${fileId}${downloadFile ? '/download' : ''}`, query),
  submissionGroupCodeBySubmission: ({ submissionId, fileId, downloadFile, query }) => Utils.setUrlParams(`/api/v1/analysis-management/submissions/${submissionId}/files/${fileId}${downloadFile ? '/download' : ''}`, query),
  submissionResults: ({ submissionId, fileId, downloadFile, query }) => Utils.setUrlParams(`/api/v1/analysis-management/submissions/${submissionId}/results/${fileId}${downloadFile ? '/download' : ''}`, query),
  submissionGroupCodeAll: ({ submissionGroupId }) => `/api/v1/analysis-management/submission-groups/${submissionGroupId}/files/all`,
  submissionResultsDownload: ({ submissionId, fileId }) => `/api/v1/analysis-management/submissions/${submissionId}/results/${fileId}/download`,
  submissionFilesDownload: ({ submissionGroupId, fileId }) => `/api/v1/analysis-management/submission-groups/${submissionGroupId}/files/${fileId}/download`,
  submissionResultAll: ({ submissionId }) => `/api/v1/analysis-management/submissions/${submissionId}/results/all`,
  submissions: ({ analysisId }) => `/api/v1/analysis-management/${analysisId}/submissions`,
  uploadResultFile: () => '/api/v1/analysis-management/submissions/result/manualupload',
  submissionResultDelete: ({ submissionId, fileId }) => `/api/v1/analysis-management/submissions/${submissionId}/result/${fileId}`,
  submissionCodeFiles: ({ submissionId }) => `/api/v1/analysis-management/submissions/${submissionId}/results`,
  submissionGroupCodeFiles: ({ submissionGroupId }) =>
    `/api/v1/analysis-management/submission-groups/${submissionGroupId}/files`,

  shortAnalysis: ({ id }) => `/api/v1/analysis-management/analyses/${id}/short`,
  submission: ({ id }) => `/api/v1/analysis-management/submissions/${id}`,
  submissionGroups: ({ analysisId }) => `/api/v1/analysis-management/analyses/${analysisId}/submission-groups`,
};

const analysisPermissions = {
  editAnalysis: 'EDIT_ANALYSIS',
  createSubmission: 'CREATE_SUBMISSION',
  deleteAnalysisFiles: 'DELETE_ANALYSIS_FILES',
  uploadAnalysisFiles: 'UPLOAD_ANALYSIS_FILES',
};

const fileTypes = keyMirror({
  SUBMISSION_RESULT: null,
});

const statusesForPublishing = ['PENDING', 'NOT APPROVED', 'IN PROGRESS'];

const refreshTime = 10000;

const statusColors = {
  QUEUE_PROCESSING: 'grey',
  PENDING: 'orange',
  NOT_APPROVED: 'red',
  IN_PROGRESS: 'blue',
  EXECUTED: 'purple',
  FAILED: 'red',
  EXECUTED_REJECTED: 'red',
  FAILED_REJECTED: 'red',
  EXECUTED_PUBLISHED: 'green',
  FAILED_PUBLISHED: 'red',
};

const repeatTypes = [
  {
    label: 'Once',
    value: 'ONCE',
  },
  {
    label: 'Daily',
    value: 'DAILY',
  },
  {
    label: 'Weekly',
    value: 'WEEKLY',
  },
  {
    label: 'Monthly',
    value: 'MONTHLY',
  },
  {
    label: 'Yearly',
    value: 'YEARLY',
  },
];

const pageSize = {
  insightCode: 10,
  insightResult: 10,
};

const submissionActionTypes = keyMirror({
  EXECUTE: null,
  MANUAL_UPLOAD: null,
  PUBLISH: null,
  HIDE: null,
});

const importableAnalysisTypes = ['COHORT', 'ESTIMATION', 'PREDICTION', 'COHORT_CHARACTERIZATION', 'INCIDENCE'];
const analysisTypeNames = {
  COHORT: 'cohort',
  ESTIMATION: 'PLE analysis',
  PREDICTION: 'PLP analysis',
  COHORT_CHARACTERIZATION: 'cohort',
  INCIDENCE: 'incidence rates',
  CUSTOM: 'custom',
};
const pluralAnalysisTypeNames = {
  COHORT: 'cohorts',
  ESTIMATION: 'PLE analyses',
  PREDICTION: 'PLP analyses',
  COHORT_CHARACTERIZATION: 'cohorts',
  INCIDENCE: 'incidence rates',
  CUSTOM: 'custom',
};
function nameAnalysisType({ analysisType, capitalize = false, plural = false }) {
  const typeNames = plural ? pluralAnalysisTypeNames : analysisTypeNames;
  if (!(analysisType in typeNames)) {
    return '';
  }
  let name = typeNames[analysisType];
  if (capitalize) {
    name = `${name.substr(0, 1).toUpperCase()}${name.substr(1)}`;
  }

  return name;
}

const docTypes = {
  COHORT: 'application/vnd.odysseusinc.cohort',
  ESTIMATION: 'application/vnd.odysseusinc.estimation',
  PACKRAT: 'packrat bundle',
};

const fileSources = keyMirror({
  ANALYSIS: null,
  SUBMISSION: null,
});

const maxFilesCount = 10000;

const breadcrumbTypes = keyMirror({
  ANALYSIS: null,
  STUDY: null,
  INSIGHT: null,
});

const analysisTypes = keyMirror({
  INCIDENCE: null,
  COHORT: null,
  COHORT_CHARACTERIZATION: null,
  ESTIMATION: null,
  PREDICTION: null,
});

const submissionGroupsPageSize = 5;

const submissionStatuses = [
  {
    value: 'PENDING',
    label: 'Pending execution',
  },
  {
    value: 'NOT_APPROVED',
    label: 'Not approved',
  },
  {
    value: 'STARTING',
    label: 'In queue',
  },
  {
    value: 'QUEUE_PROCESSING',
    label: 'Queue processing',
  },
  {
    value: 'IN_PROGRESS',
    label: 'In progress',
  },
  {
    value: 'EXECUTED',
    label: 'Avaiting approval (success)',
  },
  {
    value: 'FAILED',
    label: 'Awaiting approval (failed)',
  },
  {
    value: 'EXECUTED_REJECTED',
    label: 'Rejected (executed)',
  },
  {
    value: 'FAILED_REJECTED',
    label: 'Rejected (failed)',
  },
  {
    value: 'EXECUTED_PUBLISHED',
    label: 'Finished',
  },
  {
    value: 'FAILED_PUBLISHED',
    label: 'Failed (published)',
  },
];

const submissionFilters = {
  showHidden: {
    name: 'showHidden',
    label: 'Show hidden',
  },
  hasInsight: {
    name: 'hasInsight',
    label: 'Has insight',
  },
  dataSourceIds: {
    name: 'dataSourceIds',
    label: 'Datasource',
  },
  submissionStatuses: {
    name: 'submissionStatuses',
    label: 'Status',
  },
};

export {
  apiPaths,
  form,
  modal,
  pageSize,
  paths,
  statusesForPublishing,
  refreshTime,
  statusColors,
  submissionActionTypes,
  repeatTypes,
  importableAnalysisTypes,
  nameAnalysisType,
  docTypes,
  fileSources,
  maxFilesCount,
  analysisPermissions,
  fileTypes,
  breadcrumbTypes,
  analysisTypes,
  submissionGroupsPageSize,
  submissionStatuses,
  submissionFilters,
};
