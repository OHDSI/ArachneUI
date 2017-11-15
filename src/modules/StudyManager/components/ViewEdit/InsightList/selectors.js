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
 * Created: July 13, 2017
 *
 */

// @ts-check
import { createSelector } from 'reselect';
import { get } from 'services/Utils';
import { dsConverter } from 'components/LabelDataSource';

export default class SelectorsBuilder {
  getRawInsights(state) {
    return get(state, 'studyManager.studyInsights.data', [], 'Array');
  }
  /**
   * @returns {
      Array<{
        title: string,
        descr: string,
        createdAt: number,
        analysis: {
          id: number,
          title: string,
        },
        dataSource: {
          id: number,
        },
        submission: {
          id: number,
          status: string,
        },
        resultFiles: Array<{}>,
        commentsCount: number,
        annotationList: Array<{
            date: number,
            text: string,
            user: string,
            responseDetails: {
              label: string,
              entity: string,
            },
          };
        }>,
      }>
    }
  */
  getInsights(rawInsights) {
    return rawInsights.map((insight) => {
      return {
        title: insight.name,
        descr: insight.description,
        createdAt: insight.created,
        analysis: {
          id: insight.analysis.id,
          title: insight.analysis.title,
        },
        dataSource: {
          id: insight.dataSource.id,
          ...dsConverter(insight.dataSource),
        },
        submission: {
          id: insight.submission.id,
          status: insight.submission.status,
        },
        resultFiles: insight.resultFiles,
        commentsCount: insight.commentsCount,
        annotationList: insight.recentCommentEntities.map((commentEntity) => {
          const comment = commentEntity.topic.comments[0];
          return {
            date: comment.date,
            text: comment.comment,
            user: commentEntity.topic.comments[0].author,
            responseDetails: {
              label: 'about',
              entity: commentEntity.label || commentEntity.name,
            },
          };
        }),
      };
    });
  }

  buildSelectorForInsights() {
    return createSelector(
      [this.getRawInsights],
      this.getInsights
    );
  }

  build() {
    return {
      getInsights: this.buildSelectorForInsights(),
    };
  }
}
