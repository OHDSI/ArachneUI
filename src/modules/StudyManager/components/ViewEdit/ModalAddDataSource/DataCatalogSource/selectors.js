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
 * Created: June 23, 2017
 *
 */

import { createSelector } from 'reselect';
import { get } from 'services/Utils';
import { dsConverter } from 'components/LabelDataSource';

export default class selectorsBuilder {
  getRawDataSourceList(state) {
    return get(state, 'studyManager.dataSourceList.data.result.content', [], 'Array');
  }

  getDataSourceList(dataSourceList) {
    return dataSourceList.map(dataSource => ({
      ...dsConverter(dataSource),
      value: dataSource.id,
    }));
  }

  buildSelectorForDataSourceList() {
    return createSelector(
      [this.getRawDataSourceList],
      this.getDataSourceList
    );
  }

  build() {
    return {
      getDataSourceList: this.buildSelectorForDataSourceList(),
    };
  }
}
