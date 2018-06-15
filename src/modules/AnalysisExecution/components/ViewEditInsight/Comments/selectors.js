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
 * Created: May 11, 2017
 *
 */

import { createSelector } from 'reselect';
import get from 'lodash/get';

const getSelectedFile = state => get(state, 'analysisExecution.insightFile.data', null);
const getFileCommentList = state => get(state, 'analysisExecution.insightComments.queryResult.result.comments', []);
const getRecentCommentedEntities = state => get(state, 'analysisExecution.insight.data.result.recentCommentEntities', []);

const convertComment = comment => ({
  date: comment.date,
  user: {
    id: get(comment, 'author.id'),
    firstname: get(comment, 'author.firstname'),
    lastname: get(comment, 'author.lastname'),
  },
  text: comment.comment,
});

const getCommentData = createSelector(
  [
    getSelectedFile,
    getFileCommentList,
    getRecentCommentedEntities,
  ],
  (
    selectedFile,
    fileCommentList,
    recentCommentedEntities
  ) => {
    let isRecent = null;
    let commentGroupList = [];

    if (selectedFile) {
      isRecent = false;
      commentGroupList = [{
        file: selectedFile,
        commentList: fileCommentList.map(convertComment),
      }];
    } else {
      isRecent = true;
      commentGroupList = recentCommentedEntities.map(entity => ({
        file: entity,
        commentList: get(entity, 'topic.comments', []).map(convertComment),
      }));
    }

    return {
      isRecent,
      commentGroupList,
    };
  }
);

export default {
  getCommentData,
};
