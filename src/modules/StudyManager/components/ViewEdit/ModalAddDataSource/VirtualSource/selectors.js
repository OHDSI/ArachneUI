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
 * Created: June 23, 2017
 *
 */

import { createSelector } from 'reselect';
import get from 'lodash/get';
import { form, participantStatuses } from 'modules/StudyManager/const';

export default class selectorsBuilder {
  getCurrentUserId(state) {
    return get(
      state,
      'auth.principal.queryResult.result.id',
      null
    );
  }

  getStudyParticipantList(state) {
    return get(
      state,
      'studyManager.study.data.participants',
      []
    );
  }

  getSelectedOwnerList(state) {
    return get(
      state,
      `form.${form.addVirtualSource}.values.ownerList`,
      []
    );
  }

  getCurrentUser(studyParticipantList, currentUserId) {
    const currentUser = studyParticipantList.filter(u => u.id === currentUserId)[0];
    return {
      ...currentUser,
      isRemovable: false,
    };
  }

  buildSelectorForCurrentUser() {
    return createSelector(
      [this.getStudyParticipantList, this.getCurrentUserId],
      this.getCurrentUser
    );
  }

  getDataSourceOwnerListRawData(state) {
    return get(state, 'studyManager.study.dataSource.data.dataNode.dataOwners')
  }

  getDataSourceOwnerList(currentUserId, dataSourceOwners) {
    return dataSourceOwners
      ? dataSourceOwners
      .map(dataOwner => ({
        id: dataOwner.id,
        isRemovable: currentUserId !== dataOwner.id,
        fullName: `${dataOwner.firstname} ${dataOwner.lastname}`,
      }))
      : undefined;
  }

  buildSelectorForOwnerList() {
    return createSelector(
      [this.getCurrentUserId, this.getDataSourceOwnerListRawData],
      this.getDataSourceOwnerList
    );
  }

  getOwnerOptions(participantList, selectedOwnerList) {
    // Filter pending users
    const filteredList = participantList
      .filter(u => ![participantStatuses.PENDING, participantStatuses.DELETED].includes(u.status));

    // Remove duplicates
    // (which appear because or diferent roles of the same person)
    const participantSet = {};
    filteredList.forEach((user) => {
      if (!participantSet.hasOwnProperty(user.id)) { // eslint-disable-line no-prototype-builtins
        participantSet[user.id] = user;
      }
    });

    // Remove already selected users
    selectedOwnerList.forEach((user) => {
      delete participantSet[user.id];
    });

    return Object.values(participantSet)
      .filter(u => u)
      .map(participant => ({
        label: participant.fullName,
        value: {
          ...participant,
          isRemovable: true,
        },
      }));
  }

  // For autocomplete
  buildSelectorForOwnerOptions() {
    return createSelector(
      [this.getStudyParticipantList, this.getSelectedOwnerList],
      this.getOwnerOptions
    );
  }

  build() {
    return {
      getCurrentUser: this.buildSelectorForCurrentUser(),
      getDataSourceOwnerList: this.buildSelectorForOwnerList(),
      getOwnerOptions: this.buildSelectorForOwnerOptions(),
      getSelectedOwnerList: this.getSelectedOwnerList,
    };
  }
}
