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
 * Created: December 13, 2016
 *
 */

import { createSelector } from 'reselect';
import get from 'lodash/get';
import reduce from 'lodash/reduce';
import { statusColors } from 'modules/StudyManager/const';
import { sortOptions } from 'services/Utils';

export default class SelectorsBuilder {
  getTypeList(state) {
    return get(state, 'studyManager.typeList.data.result') || [];
  }

  getTypeOptions(typeList) {
    const typeOptions = typeList.map(type => ({
      label: type.name,
      value: type.id,
    }));
    return sortOptions(typeOptions);
  }
  
  buildSelectorForTypeOptions() {
    return createSelector(
      [this.getTypeList],
      this.getTypeOptions
    );
  }

  getStatusList(state) {
    return get(state, 'studyManager.statusList.data.result') || [];
  }

  getAvailableTransitionList(state) {
    return get(state, 'studyManager.availableTransitions.queryResult') || [];
  }

  getStudyStatus(state) {
    return get(state, 'studyManager.study.data.status.name');
  }

  getStatusOptions(statusList, transitionList, studyStatus) {
    const statuses = transitionList.map(transition => ({
      name: get(transition, 'to.name', []),
      isInfo: get(transition, 'info'),
    }));

    const tooltipsHashMap = reduce(transitionList, (hash, value) => {
      const key = get(value, 'to.name', '');
      hash[key] = get(value, 'description', '');
      return hash;
    }, {});

    const nonInfoStatuses = statuses.filter(s => !s.isInfo).map(s => s.name);

    return statusList.map((status) => {
      const disabled = !nonInfoStatuses.includes(status.name);
      const selected = studyStatus === status.name;
      const tooltipText = selected ? 'Current state' : get(tooltipsHashMap, `${status.name}`, 'Status cannot be changed to');
      const tooltipConf = 'left';
      return {
        label: status.name,
        value: status.id,
        color: status.name ? statusColors[status.name.toLowerCase()] : null,
        tooltipText,
        tooltipConf,
        disabled,
        selected,
      };
    });
  }

  buildSelectorForStatusOptions() {
    return createSelector(
      [this.getStatusList, this.getAvailableTransitionList, this.getStudyStatus],
      this.getStatusOptions
    );
  }

  build() {
    return {
      getTypeOptions: this.buildSelectorForTypeOptions(),
      getStatusOptions: this.buildSelectorForStatusOptions(),
    };
  }
}
