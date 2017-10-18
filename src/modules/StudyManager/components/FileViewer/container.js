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

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { get, detectLanguageByExtension } from 'services/Utils';
import actions from 'actions/index';
import { isFat as isMimeTypeFat } from 'services/MimeTypeUtil';
import presenter from './presenter';
import { apiPaths, paths } from 'modules/StudyManager/const';

class StudyFile extends Component {

  componentWillMount() {
    this.props.loadStudyFile({
      studyId: this.props.studyId,
      fileId: this.props.fileUuid,
      withContent: false,
    });
  }

  componentWillReceiveProps(props) {
    if (!props.isLoading && !props.content && props.mimeType && !isMimeTypeFat(props.mimeType)) {
      this.props.loadStudyFile({
        studyId: this.props.studyId,
        fileId: this.props.fileUuid,
        withContent: !isMimeTypeFat(props.mimeType),
      });
    }
  }

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state, ownProps) {

  const fileUuid = ownProps.params.fileUuid;
  const studyId = ownProps.params.studyId;
  const isFileLoading = get(state, 'studyManager.studyDocumentFile.isLoading', false);

  const pageTitle = [
    get(state, 'studyManager.studyDocumentFile.data.result.name', 'Study document file'),
    'Arachne',
  ];

  const downloadLink = apiPaths.studyDocumentDownload({studyId, fileUuid});

  const studyFile = get(state, 'studyManager.studyDocumentFile.data.result');
  const title = get(studyFile, 'label', '');
  const name = get(studyFile, 'name', '');
  const mimeType = get(studyFile, 'docType');
  const content = get(studyFile, 'content', null, 'String');
  const createdAt = get(studyFile, 'created');
  const language = detectLanguageByExtension(studyFile);
  return {
    isLoading: isFileLoading,
    fileUuid,
    studyId,
    pageTitle: pageTitle.join(' | '),
    content: isFileLoading ? null : content,
    mimeType,
    downloadLink,
    title,
    name,
    createdAt,
    language,
  };
}

const mapDispatchToProps = {
  loadStudyFile: actions.studyManager.studyDocumentFile.find,
};

export default connect(mapStateToProps, mapDispatchToProps)(StudyFile);
