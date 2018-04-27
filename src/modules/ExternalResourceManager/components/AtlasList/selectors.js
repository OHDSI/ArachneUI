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
 * Authors: Pavel Grafkin
 * Created: March 14, 2018
 *
 */

import { get } from 'services/Utils';
import { createSelector } from 'reselect';
import { extractPaginationData } from 'components/Grid';
import { viewModePageSize } from 'const/viewModes';

export default class SelectorsBuilder {

  getRawAtlasList(state) {
    return get(state, 'externalResourceManager.atlases.queryResult.content') || [];
  }

  getIsLoading(state) {
    return get(state, 'externalResourceManager.atlases.isLoading') || get(state, 'externalResourceManager.atlases.isDeleting');
  }

  getPaginationDetails(state) {
    const searchResults = get(state, 'externalResourceManager.atlases.queryResult');
    return extractPaginationData({ searchResults, numOfElsPerPage: viewModePageSize.DEFAULT });
  }

  buildSelectorForAtlasList() {
    return createSelector(
      [this.getRawAtlasList],
      atlasList => atlasList.map(atlas => ({
        id: atlas.id,
        name: atlas.name,
        version: atlas.version,
        url: atlas.url,
      }))
    );
  }

  build() {
    return {
      getAtlasList: this.buildSelectorForAtlasList(),
      getIsLoading: this.getIsLoading,
      getPaginationDetails: this.getPaginationDetails,
    };
  }
}
