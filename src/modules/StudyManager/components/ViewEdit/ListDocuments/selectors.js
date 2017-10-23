/**
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

import { createSelector } from 'reselect';
import get from 'lodash/get';
import { paths } from 'modules/StudyManager/const';
import fileConverter from 'components/FileInfo/converter';

export default class selectorsBuilder {
  getStudyId(state) {
    return get(state, 'studyManager.study.data.result.id') || [];
  }

  getRawDocumentList(state) {
    return get(state, 'studyManager.study.data.result.files') || [];
  }

  getDocumentList(studyId, documentList) {
    return documentList.map(doc => ({
        ...fileConverter(
          doc,
          (document) => paths.studyFile({
            studyId: document.studyId,
            fileId: document.uuid,
          }))
      })
    );
  }

  buildselectorForDocumentList() {
    return createSelector(
      [this.getStudyId, this.getRawDocumentList],
      this.getDocumentList
    );
  }

  build() {
    return {
      getDocumentList: this.buildselectorForDocumentList(),
    };
  }
}
