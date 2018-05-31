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
 * Created: October 05, 2017
 *
 */

import { createSelector } from 'reselect';
import { get } from 'services/Utils';
import { sortOptions } from 'services/Utils';
import { extractPaginationData } from 'components/Grid';
import { viewModePageSize } from 'const/viewModes';

class UserListSelectorsBuilder {

  getPaginationDetails(state) {
    const searchResults = get(state, 'adminSettings.portalUserList.queryResult');
    return extractPaginationData({
      searchResults,
      numOfElsPerPage: viewModePageSize.DEFAULT,
    });
  }

  getTenantList(state) {
    return get(state, 'adminSettings.tenantList.data') || [];
  }

  // Is used in AddUsersToTenants modal
  getTenantOptions(tenantList) {
    const tenantOptions = tenantList.map(tenant => ({
      label: tenant.name,
      value: tenant.id.toString(),
    }));
    return sortOptions(tenantOptions);
  }

  buildSelectorForTenantOptions() {
    return createSelector([this.getTenantList], this.getTenantOptions);
  }

  build() {
    return {
      getPaginationDetails: this.getPaginationDetails,
      getTenantOptions: this.buildSelectorForTenantOptions(),
    };
  }
}

export default UserListSelectorsBuilder;
