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
 *  Created: October 19, 2017
 *
 */

import { connect } from 'react-redux';
import { get, detectLanguageByExtension, ContainerBuilder } from 'services/Utils';
import actions from 'actions/index';
import DocumentViewer from './presenter';
import { apiPaths, paths } from 'modules/StudyManager/const';

export default class StudyDocumentBuilder extends ContainerBuilder {

  getComponent() {
    return DocumentViewer;
  }

  mapStateToProps(state, ownProps) {

    const fileUuid = ownProps.params.fileUuid;
    const studyId = ownProps.params.studyId;
    const isFileLoading = get(state, 'studyManager.studyDocumentFile.isLoading', false);

    const studyFile = get(state, 'studyManager.studyDocumentFile.data');

    const pageTitle = [get(studyFile, 'name', 'Study document file'),'Arachne'];

    const urlParams = { fileUuid, studyId };

    const backUrl = paths.studies(get(studyFile, 'studyId'));
    const toolbarOpts = {
      backUrl,
      breadcrumbList: [
        {
          label: 'Studies',
          link: paths.studies(),
        },
        {
          label: get(studyFile, 'studyLabel'),
          link: backUrl,
        },
      ],
      title: get(studyFile, 'label') || get(studyFile, 'name'),
    };

    return {
      file: studyFile,
      urlParams,
      isLoading: isFileLoading,
      pageTitle: pageTitle.join(' | '),
      downloadLink: apiPaths.studyDocumentDownload(urlParams),
      toolbarOpts,
    };
  }

  getMapDispatchToProps() {
    return {
      loadFile: actions.studyManager.studyDocumentFile.find,
    };
  }
}