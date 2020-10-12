/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
 * Created: August 30, 2017
 *
 */

// @ts-check
import { createSelector } from 'reselect';
import { get } from 'services/Utils';

class selectorsBuilder {
  getRawStudyList(state) {
    return get(state, 'studyManager.studyList.data.result.content') || [];
  }

  getStudy(rawStudy) {
    return {
      id: rawStudy.id,
      favourite: rawStudy.favourite,
      title: rawStudy.title,
      leadList: rawStudy.leadList,
      role: get(rawStudy, 'role', 'Reader', 'String'),
      created: rawStudy.created,
      type: rawStudy.type,
      status: rawStudy.status,
      endDate: rawStudy.endDate,
      isPrivate: rawStudy.privacy,
    };
  }

  /**
   * @returns {
      Array<{
        id: number,
        favourite: boolean,
        title: string,
        leadList: Array<{ link: string, label: string }>,
        role: string,
        created: number,
        type: object,
        status: string,
        endDate: number,
      }>
    }
  */
  getStudyList(rawStudyList) {
    return rawStudyList.map(this.getStudy);
  }

  buildSelectorForStudyList() {
    return createSelector([this.getRawStudyList], this.getStudyList.bind(this));
  }

  build() {
    return {
      getStudyList: this.buildSelectorForStudyList(),
    };
  }
}

export default selectorsBuilder;
