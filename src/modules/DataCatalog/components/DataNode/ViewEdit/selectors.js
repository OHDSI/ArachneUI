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
 * Authors: Alexander Saltykov
 * Created: June 25, 2018
 *
 */

import { createSelector } from 'reselect';
import { get } from 'services/Utils';
import { dsConverter } from 'components/LabelDataSource';
import { dataNodePermissions } from 'modules/DataCatalog/const';

export class DataNodeSelectors {
  getRawSources(state) {
    return get(state, 'dataCatalog.dataNodeDataSources.queryResult', [], 'Array');
  }

  getDataNode(state) {
    const dn = get(state, 'dataCatalog.dataNode.data.result', {
      name: '',
      description: '',
      organization: { name: 'Unknown', id: -1 },
      permissions: {},
    });
    dn.editable = dn.permissions[dataNodePermissions.edit] === true;

    return dn;
  }

  buildSelectorForSources() {
    return createSelector(
      [this.getRawSources, this.getDataNode],
      (sources, dataNode) => sources.map(ds => dsConverter({
        ...ds,
        dataNode,
      }))
    );
  }

  build() {
    return {
      getDataSources: this.buildSelectorForSources(),
      getDataNode: this.getDataNode,
    };
  }
}
