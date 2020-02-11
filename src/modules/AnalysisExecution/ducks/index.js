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
 * Created: September 27, 2017
 *
 */

import analysis from './analysis';
import analysisTypes from './analysisTypes';
import analysisCode from './analysisCode';
import breadcrumbs from './breadcrumbs';
import importEntity from './importEntity';
import importEntityOptionList from './importEntityOptionList';
import insightComments from './insightComments';
import insight from './insight';
import studyDataSourceList from './studyDataSourceList';
import statusHistory from './statusHistory';
import submissionResultFile from './submissionResultFile';
import submissionGroupFile from './submissionGroupFile';
import submissionFileDetails from './submissionFileDetails';

import code from './code';
import codeLock from './codeLock';
import executionStatus from './executionStatus';
import publishStatus from './publishStatus';
import submission from './submission';
import resultFile from './resultFile';
import insightFile from './insightFile';
import fileTreeData from './fileTreeData';
import submissionSummary from './submissionSummary';
import submissionGroups from './submissionGroups';

import pathwaySummary from './pathwaySummary';

export default {
  actions: {
    analysis: analysis.actions,
    analysisTypes: analysisTypes.actions,
    analysisCode: analysisCode.actions,
    breadcrumbs: breadcrumbs.actions,
    importEntity: importEntity.actions,
    importEntityOptionList: importEntityOptionList.actions,
    insightComments: insightComments.actions,
    insight: insight.actions,
    studyDataSourceList: studyDataSourceList.actions,
    statusHistory: statusHistory.actions,
    submissionResultFile: submissionResultFile.actions,
    submissionGroupFile: submissionGroupFile.actions,
    submissionFileDetails: submissionFileDetails.actions,
    code: code.actions,
    codeLock: codeLock.actions,
    executionStatus: executionStatus.actions,
    publishStatus: publishStatus.actions,
    submission: submission.actions,
    resultFile: resultFile.actions,
    insightFile: insightFile.actions,
    fileTreeData: fileTreeData.actions,
    submissionSummary: submissionSummary.actions,
    submissionGroups: submissionGroups.actions,
    pathwaySummary: pathwaySummary.actions,
  },
  reducer: {
    analysis: analysis.reducer,
    analysisTypes: analysisTypes.reducer,
    analysisCode: analysisCode.reducer,
    breadcrumbs: breadcrumbs.reducer,
    importEntity: importEntity.reducer,
    importEntityOptionList: importEntityOptionList.reducer,
    insightComments: insightComments.reducer,
    insight: insight.reducer,
    studyDataSourceList: studyDataSourceList.reducer,
    statusHistory: statusHistory.reducer,
    submissionResultFile: submissionResultFile.reducer,
    submissionGroupFile: submissionGroupFile.reducer,
    submissionFileDetails: submissionFileDetails.reducer,
    insightFile: insightFile.reducer,
    fileTreeData: fileTreeData.reducer,
    submissionSummary: submissionSummary.reducer,
    submissionGroups: submissionGroups.reducer,
    pathwaySummary: pathwaySummary.reducer,
  },
};
