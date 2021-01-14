/*
 *
 * Copyright 2020 Odysseus Data Services, inc.
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
 * Authors: Alex Cumarav, Vlad Belousov, Vitaly Koulakov
 * Created: October 20, 2020
 *
 */

import DuckBuilder from 'modules/AnalysisExecution/ducks/submissionFileDuckBuilder';
import {SubmissionResultZipEntryLinkBuilder} from 'modules/AnalysisExecution/ducks/linkBuilder';

const duck = new DuckBuilder();
duck.LinkBuilder = SubmissionResultZipEntryLinkBuilder;
duck.coreName = 'AE_ANALYSIS_SUBMISSION_FILE_ZIP_ENTRY';
const ducks = duck.build();

export default {
    actions: ducks.actions,
    reducer: ducks.reducer
};