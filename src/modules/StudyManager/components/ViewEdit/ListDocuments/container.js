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
 * Created: December 13, 2016
 *
 */

// @ts-check
import { Utils } from 'services/Utils';
import get from 'lodash/get';
import { ModalUtils } from 'arachne-ui-components';
import actions from 'actions/index';
import { modal, apiPaths, studyPermissions } from 'modules/StudyManager/const';
import mimeTypes from 'const/mimeTypes';
import SelectorsBuilder from './selectors';
import ListDocuments from './presenter';

const selectors = (new SelectorsBuilder()).build();

export default class ListDocumentsBuilder {
  getComponent() {
    return ListDocuments;
  }

  mapStateToProps(state) {
    const studyData = get(state, 'studyManager.study.data.result');
    const studyId = get(studyData, 'id');
    const documentList = selectors.getDocumentList(state);
    const filesList = documentList.filter(doc => doc.docType !== mimeTypes.link);
    const canDownload = filesList.length !== 0;

    return {
      studyId: get(studyData, 'id'),
      documentList,
      isEditable: get(studyData, `permissions[${studyPermissions.uploadFiles}]`, false),
      downloadAllLink: apiPaths.studyDocumentDownloadAll({ studyId }),
      canDownload,
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      openCreateModal: ModalUtils.actions.toggle.bind(null, modal.createDocument, true),
      loadStudy: actions.studyManager.study.find,
      removeDocument: actions.studyManager.study.document.delete,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      removeDocument(fileId) {
        Utils.confirmDelete({
          message: 'Are you sure want to delete this file?',
        })
          .then(() => {
            dispatchProps
              .removeDocument({ studyId: stateProps.studyId, fileUuid: fileId, action: 'remove' })
              .then(() => dispatchProps.loadStudy(stateProps.studyId));
          });
      },
    };
  }

  build() {
    return Utils.buildConnectedComponent({
      Component: this.getComponent(),
      mapStateToProps: this.mapStateToProps,
      mapDispatchToProps: this.getMapDispatchToProps(),
      mergeProps: this.mergeProps,
    });
  }
}
