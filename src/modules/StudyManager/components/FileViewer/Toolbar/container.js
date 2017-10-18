/*
 *  Copyright 2017 Observational Health Data Sciences and Informatics
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 *  Company: Odysseus Data Services, Inc.
 *  Product Owner/Architecture: Gregory Klebanov
 *  Authors: Anton Gackovka
 *  Created: October 18, 2017
 *
 */

import { connect } from 'react-redux';
import get from 'lodash/get';
import Toolbar from './presenter';
import { apiPaths, paths } from 'modules/StudyManager/const';


function mapStateToProps(state) {
  const studyDocumentData = get(state, 'studyManager.studyDocumentFile.data.result');

  const breadcrumbList = [
    {
      label: 'Studies',
      link: paths.studies(),
    },
    {
      label: get(studyDocumentData, 'studyLabel'),
      link: paths.studies(get(studyDocumentData, 'studyId')),
    },
  ];

  const backUrl = paths.studies();

  return {
    title: get(studyDocumentData, 'label') || get(studyDocumentData, 'name'),
    backUrl,
    breadcrumbList,
  };
}

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
