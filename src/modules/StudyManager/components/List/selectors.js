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
 * Created: September 29, 2017
 *
 */

// @ts-check
import { createSelector } from 'reselect';
import get from 'lodash/get';
import { sortOptions } from 'services/Utils';
import { extractPaginationData } from 'components/Grid';
import {
  statusColors,
} from 'modules/StudyManager/const';
import { viewModes, viewModePageSize } from 'const/viewModes';

export default class SelectorsBuilder {
  // Dummy getters

  getTypeList(state) {
    return get(state, 'studyManager.typeList.data.result') || [];
  }

  getStatusList(state) {
    return get(state, 'studyManager.statusList.data.result') || [];
  }

  // Pagination details

  getPaginationDetails(state) {
    const searchResults = get(state, 'studyManager.studyList.data.result');
    const query = state.routing.locationBeforeTransitions.query;
    const numOfElsPerPage = viewModePageSize[get(query, 'view') || viewModes.TABLE];

    return extractPaginationData({ searchResults, numOfElsPerPage });
  }

  // Type options

  getTypeOptions(typeList) {
    const typeOptions = typeList.map(type => ({
      label: type.name,
      value: type.id.toString(),
    }));
    return sortOptions(typeOptions);
  }

  buildSelectorForTypeOptions() {
    return createSelector([this.getTypeList], this.getTypeOptions);
  }

  // status options

  getStatusOptions(statusList) {
    return statusList.map(status => ({
      label: status.name,
      value: status.id.toString(),
      color: status.name ? statusColors[status.name.toLowerCase()] : null,
    }));
  }

  buildSelectorForStatusOptions() {
    return createSelector([this.getStatusList], this.getStatusOptions);
  }

  build() {
    return {
      getPaginationDetails: this.getPaginationDetails,
      getTypeOptions: this.buildSelectorForTypeOptions(),
      getStatusOptions: this.buildSelectorForStatusOptions(),
    };
  }
}
