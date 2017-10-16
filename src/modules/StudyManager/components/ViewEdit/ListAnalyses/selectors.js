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

export default class selectorsBuilder {
  getRawAnalysisList(state){
    return get(state, 'studyManager.study.data.result.analyses') || [];
  }

  getAnalysisList(analysisList) {
    return analysisList.map(item => ({
      id: item.id,
      title: item.title,
      link: paths.analyses(item.id),
      isRemovable: get(item, 'permissions.DELETE_ANALYSIS', false),
      createdAt: item.created,
      author: {
        ...item.author,
        link: (item.author && item.author.id) ? paths.user(item.author.id) : null,
      },
    }));
  }

  buildSelectorForAnalysisList() {
    return createSelector(
      [this.getRawAnalysisList],
      this.getAnalysisList
    );
  }

  build() {
    return {
      getAnalysisList: this.buildSelectorForAnalysisList(),
    };
  }
}
