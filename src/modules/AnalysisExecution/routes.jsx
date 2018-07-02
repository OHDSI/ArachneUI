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
 * Created: December 27, 2016
 *
 */

import React from 'react';
import { Route } from 'react-router';

import ViewEditAnalysis from './components/ViewEditAnalysis/index';
import AnalysisCodeEditor from './components/AnalysisCodeEditor/index';
import ViewEditInsight from './components/ViewEditInsight';
import SubmissionCodeViewer from './components/SubmissionCodeViewer';
import SubmissionResultFile from './components/SubmissionCodeViewer/ResultFile';
import SubmissionGroupFile from './components/SubmissionCodeViewer/GroupFile';

function Routes() {
  return [
    <Route path="analyses/:analysisId" component={ViewEditAnalysis} />,
    <Route path="analyses/:analysisId/code/:analysisCodeId" component={AnalysisCodeEditor} />,
    <Route path="submissions/:submissionId/insight" component={ViewEditInsight} />,
    // Show query code from Analysis page
    <Route
    	path="submission-groups/:submissionGroupId/code/:fileId"
    	component={SubmissionGroupFile}
    	type="query"
    	from="SUBMISSION_GROUP"
    />,
    // Show result code from Analysis page
    <Route
    	path="submissions/:submissionId/results/:fileId"
    	component={SubmissionResultFile}
    	type="result"
    	from="SUBMISSION"
    />,
    <Route
    	path="submissions/:submissionId/results"
    	component={SubmissionResultFile}
    	type="result"
    	from="SUBMISSION"
    />,
    // Show query code from Insight page
    <Route
    	path="submissions/:submissionId/insight/code/:fileId"
    	component={SubmissionGroupFile}
    	type="query"
    	from="INSIGHT"
    />,
    // Show result code from Insight page
    <Route
    	path="submissions/:submissionId/insight/results/:fileId"
    	component={SubmissionResultFile}
    	type="result"
    	from="INSIGHT"
    />,
  ];
}

export default Routes;
