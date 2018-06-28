/*
 *
 * Copyright 2018 Observational Health Data Sciences and Informatics
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
 * Created: August 25, 2017
 *
 */

import { createSelector } from 'reselect';
import { get } from 'services/Utils';
import moment from 'moment-timezone';
import { humanDate } from 'const/formats';
import { paths as expertPaths } from 'modules/ExpertFinder/const';

export default class SelectorsBuilder {
  getRawInsightList(state) {
    return get(state, 'insightsLibrary.insights.queryResult.content', [], 'Array');
  }

  getInsight(entity) {
    return {
      id: entity.id,
      publishState: entity.publishState,
      publishedDate: entity.publishedDate,
      favourite: entity.favourite,
      study: {
        title: entity.study.title,
        objective: entity.study.description,
        lead: entity.study.studyLeads.map(user => ({
          link: expertPaths.profile(user.id),
          label: user.fullName,
        })),
        participants: entity.study.studyParticipants.map(user => ({
          id: user.id,
          link: expertPaths.profile(user.id),
          label: user.fullName,
        })),
        created: moment(entity.study.created).format(humanDate),
        startDate: moment(entity.study.startDate).format(humanDate),
        endDate: moment(entity.study.endDate).format(humanDate),
      },
    };
  }

  getInsightList(rawInsightList) {
    return rawInsightList.map(this.getInsight);
  }
  
  buildSelectorForInsightsList() {
    return createSelector(
        [this.getRawInsightList],
        this.getInsightList.bind(this)
    );
  }

  build() {
    return {
      getInsightList: this.buildSelectorForInsightsList(),
    };
  }
}
