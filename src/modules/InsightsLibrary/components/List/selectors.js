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
 * Authors: Pavel Grafkin
 * Created: October 31, 2017
 *
 */

// @ts-check
import { get } from 'services/Utils';
import { extractPaginationData } from 'components/Grid';
import { viewModes, viewModePageSize } from 'const/viewModes';

export default class SelectorsBuilder {

  getPaginationDetails(state) {
    const searchResults = get(state, 'insightsLibrary.insights.queryResult');
    const query = state.routing.locationBeforeTransitions.query;
    const numOfElsPerPage = viewModePageSize[get(query, 'view') || viewModes.TABLE];

    return extractPaginationData({ searchResults, numOfElsPerPage });
  }

  build() {
    return {
      getPaginationDetails: this.getPaginationDetails,
    };
  }
}
