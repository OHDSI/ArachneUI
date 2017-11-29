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
 * Created: October 03, 2017
 *
 */

import { createSelector } from 'reselect';
import { fieldTypes } from 'modules/ExpertFinder/const';
import { Utils, get } from 'services/Utils';
import { extractPaginationData } from 'components/Grid';
import { viewModePageSize } from 'const/viewModes';

const getRawProfessionalTypes = state => get(state, 'expertFinder.professionalTypes.queryResult.result') || [];
const getFacets = state => get(state, 'expertFinder.expertsList.queryResult.result.facets') || [];

const getFilterList = createSelector(
  [getRawProfessionalTypes, getFacets],
  (professionalTypes, facets) => {
    const fieldList = [
      {
        label: 'Professional type',
        name: 'professionalType',
        type: fieldTypes.enum,
        isMulti: true,
        options: professionalTypes.map(type => ({
          label: type.name,
          // To string is required, because filter picks selected values from url,
          // where they are presented as strings
          value: type.id.toString(),
        })),
        forceOpened: true,
      },
    ];

    // Set facets
    Utils.assignFacets(fieldList, facets);

    return fieldList;
  }
);

const getPaginationDetails = (state) => {
  const searchResults = get(state, 'expertFinder.expertsList.queryResult.result');
  return extractPaginationData({
    searchResults,
    numOfElsPerPage: viewModePageSize.DEFAULT,
    startsFromOne: true,
  });
};

export default {
  getFilterList,
  getPaginationDetails,
};
