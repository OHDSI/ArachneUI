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
 * Created: December 13, 2016
 *
 */

import { createSelector } from 'reselect';
import { get } from 'services/Utils';
import {
  paths,
  participantRoles,
  participantStatuses,
  studyPermissions,
} from 'modules/StudyManager/const';
import { dsConverter } from 'components/LabelDataSource';

export default class selectorsBuilder {
  getRawParticipantList(state) {
    return get(state, 'studyManager.study.data.participants') || [];
  }

  getRawDataSourceList(state) {
    return get(state, 'studyManager.study.data.dataSources', [], 'Array');
  }

  hasEditPermissions(state) {
    return get(
      state,
      `studyManager.study.data.permissions[${studyPermissions.inviteContributor}]`,
      false
    );
  }

  getStatus(participant) {
    let status = participant.status.toLowerCase();
    if (status === 'deleted') {
      status = 'disabled';
    }
    return status;
  }

  isDeleted(participant) {
    return participant.status === participantStatuses.DELETED;
  }

  isApproved(participant) {
    return participant.status === participantStatuses.APPROVED;
  }

  canBeRemoved(participant, leadCount) {
    let result;

    if (this.isDeleted(participant)) {
      result = false;
    } else {
      switch (participant.role.id) {
        case participantRoles.CONTRIBUTOR:
          result = true;
          break;
        case participantRoles.DATA_SET_OWNER:
          result = false;
          break;
        case participantRoles.LEAD_INVESTIGATOR:
          result = leadCount > 1 || participant.status === participantStatuses.PENDING;
          break;
        default: break;
      }
    }

    return result;
  }

  canBeRecreated(participant) {
    return participant.canBeRecreated && this.isDeleted(participant) && participant.role.id !== participantRoles.DATA_SET_OWNER;
  }

  getParticipantList(participantList, editPermissions, dataSourceList) {
    const leadList = participantList.filter(participant =>
      participant.role.id === participantRoles.LEAD_INVESTIGATOR
    );
    const leadCount = leadList.filter(participant => this.isApproved(participant)).length;

    return participantList.map(item => ({
      id: item.id,
      fullName: item.fullName,
      role: item.role,
      link: paths.user(item.id),
      status: this.getStatus(item),
      canBeRemoved: this.canBeRemoved(item, leadCount) && editPermissions,
      canBeRecreated: this.canBeRecreated(item) && editPermissions,
      comment: item.comment,
      ownedDataSource: item.ownedDataSourceId
        ? dsConverter(dataSourceList.filter(ds => ds.id === item.ownedDataSourceId)[0] || {})
        : {},
    }));
  }

  buildSelectorForParticipantList() {
    return createSelector(
      [
        this.getRawParticipantList,
        this.hasEditPermissions,
        this.getRawDataSourceList,
      ],
      this.getParticipantList.bind(this)
    );
  }

  build() {
    return {
      getParticipantList: this.buildSelectorForParticipantList(),
      hasEditPermissions: this.hasEditPermissions,
    };
  }
}

