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
 * Created: July 19, 2017
 *
 */

// @ts-check
import { createSelector } from 'reselect';
import { get } from 'services/Utils';
import moment from 'moment-timezone';
import { humanDate } from 'const/formats';
import { participantStatuses } from 'modules/StudyManager/const';
import { apiPaths, paperFileType, paths } from 'modules/InsightsLibrary/const';
import fileConverter from 'components/FileInfo/converter';
import { dsConverter } from 'components/LabelDataSource';

export default class SelectorsBuilder {
  getRawInsight(state) {
    return get(
      state,
      'insightsLibrary.insights.data',
      {},
      'Object'
    );
  }

  userConverter(user) {
    return {
      id: user.id,
      name: user.fullName,
    };
  }

  extendedUserConverter(user) {
    return {
      id: user.id,
      name: user.fullName,
      subtitle: [user.affilation, user.professionalType.name].filter(text => text).join(', '),
    };
  }

  getInsight(entity) {
    return {
      id: entity.id,
      studyTitle: get(entity, 'study.title'),
      objective: get(entity, 'study.description'),
      leadList: (get(entity, 'study.studyLeads') || []).filter(p => p.status === participantStatuses.APPROVED).map(this.userConverter),
      participants: (get(entity, 'study.studyParticipants') || []).map(this.extendedUserConverter),
      dataSourceList: (get(entity, 'study.studyDataSources') || []).map(v => ({
        ...v,
        uuid: v.id
      })).map(dsConverter),
      studyCreated: moment(get(entity, 'study.created')).format(humanDate),
      studyStartDate: moment(get(entity, 'study.startDate')).format(humanDate),
      studyEndDate: moment(get(entity, 'study.endDate')).format(humanDate),
      publishedDate: get(entity, 'publishedDate')
        ? moment(entity.study.publishedDate).format(humanDate)
        : null,
      protocols: entity.protocols
        ? entity.protocols.map(protocol => ({
            ...fileConverter(protocol,
              ({ uuid }) => paths.insightFile({
                insightId: entity.id,
                fileUuid: uuid,
                query: { type: paperFileType.PROTOCOL },
              })),
            type: paperFileType.PROTOCOL,
          }))
        : null,
      papers: entity.papers
        ? entity.papers.map(paper => ({
            ...fileConverter(paper,
              ({ uuid }) => paths.insightFile({
                insightId: entity.id,
                fileUuid: uuid,
                query: { type: paperFileType.PAPER },
              })),
            type: paperFileType.PAPER,
          }))
        : null,
    };
  }

  buildSelectorForInsight() {
    return createSelector(
      [this.getRawInsight],
      this.getInsight.bind(this)
    );
  }

  build() {
    return {
      getInsight: this.buildSelectorForInsight(),
    };
  }
}
