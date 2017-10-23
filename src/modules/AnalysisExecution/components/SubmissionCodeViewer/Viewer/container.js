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
 * Created: June 13, 2017
 *
 */

import { connect } from 'react-redux';
import get from 'lodash/get';
import { downloadLinkBuilder } from 'modules/AnalysisExecution/ducks/submissionFile';
import Viewer from './presenter';

function mapStateToProps(state) {
  const submissionFileData = get(state, 'analysisExecution.submissionFile.data.result');
  const fileRequestParams = get(state, 'analysisExecution.submissionFile.requestParams.url');

  const title = get(submissionFileData, 'label', '');
  const name = get(submissionFileData, 'name', '');
  const docType = get(submissionFileData, 'docType');

  let language;
  if (docType === 'r') {
    language = 'r';
  } else if (docType === 'sql') {
    language = 'text/x-sql';
  }

  return {
    title: title || name,
    downloadLink: downloadLinkBuilder(fileRequestParams),
    language,
    value: get(submissionFileData, 'content'),
    createdAt: get(submissionFileData, 'created'),
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Viewer);
