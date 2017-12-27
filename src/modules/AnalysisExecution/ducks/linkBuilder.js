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
 * Created: September 27, 2017
 *
 */

import { apiPaths } from 'modules/AnalysisExecution/const';
import isEmpty from 'lodash/isEmpty';

export class LinkBuilder {
  constructor(params) {
    this.params = params;
    this.build = this.build.bind(this);
  }

  getLink() {
    return '';
  }

  build(params) {
    if (!isEmpty(params)) {
      this.params = params;
    }
    return this.getLink();
  }
}

export class SubmissionResultLinkBuilder extends LinkBuilder {
  getLink() {
    return apiPaths.submissionResults({
      submissionId: this.params.submissionId,
      fileId: this.params.fileId,
      downloadFile: this.params.downloadFile,
      query: this.params.query,
    });
  }
}

export class SubmissionGroupLinkBuilder extends LinkBuilder {
  getLink() {
    const urlParams = {
      fileId: this.params.fileId,
      downloadFile: this.params.downloadFile,
      query: this.params.query,
    };

    if (this.params.submissionGroupId) {
      urlParams.submissionGroupId = this.params.submissionGroupId;
      return apiPaths.submissionGroupCode(urlParams);
    }
    urlParams.submissionId = this.params.submissionId;
    return apiPaths.submissionGroupCodeBySubmission(urlParams);
  }
}
