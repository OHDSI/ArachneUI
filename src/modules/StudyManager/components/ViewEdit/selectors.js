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
 * Authors: Alexander Saltykov
 * Created: December 11, 2017
 *
 */

import get from 'lodash/get';
import { createSelector } from 'reselect';

export default class SelectorsBuilder {
  getRawPermissions(state) {
    return get(state, 'studyManager.study.data.result.permissions', {});
  }

  getPermissions(rawPermissions) {
    const permissions = new Set();
    Object.entries(rawPermissions).forEach(([permission, isGranted]) => {
      if (isGranted) {
        permissions.add(permission);
      }
    });

    return permissions;
  }

  buildSelectorForGetPermissions() {
    return createSelector(
      this.getRawPermissions,
      this.getPermissions.bind(this)
    );
  }

  build() {
    return {
      getPermissions: this.buildSelectorForGetPermissions(),
    };
  }
}
