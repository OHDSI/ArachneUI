/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexandr Saltykov, Pavel Grafkin, Vitaly Koulakov, Anton Gackovka
 * Created: March 3, 2017
 *  
 */

import API from 'services/Api';
import services from '../apiServices';

import { actionTypes, resultsPageSize } from 'modules/SearchTerms/const';
import { IAppAction } from 'actions';

type searchParams = {
  sort?: string;
  order?: string;

  pageSize: number;
  page?: number;

  query?: Array<string> | string;
  vocabulary?: Array<string> | string;
  domain?: Array<string> | string;
  conceptClass?: Array<string> | string;
  standardConcept?: Array<string> | string;
  invalidReason?: Array<string> | string;
};

function pageSizeUpdated(pageSize: number): IAppAction<{ pageSize: number }> {
  return {
    type: actionTypes.SEARCH_PAGE_SIZE_UPDATED,
    payload: {
      pageSize
    },
  };
}

function changePageSize(pageSize: number) {
  return pageSizeUpdated(pageSize);
}

function load(params: searchParams) {
	return services.terms.find({ query: {
      pageSize: resultsPageSize,
      ...params,
    }
  });
}

function fetch(id: number) {
  return services.terms.get(id);
}

function fetchConceptAncestors(conceptId: number, levels: number = 10, zoomLevel: number = 4) {
  let zoom = zoomLevel;
  if (isNaN(zoomLevel)) {
    zoom = 4;
  }
  return services.relations.get(conceptId, {query: {depth: levels, zoomLevel: zoom}});
}

function fetchRelationships(conceptId: number, standards = false) {
  return services.relationships.get(conceptId, {query: {std: standards}});
}

function fetchConceptAnyRelations(conceptId: number) {

  return services.anyRelations.get(conceptId);
}

export default {
  changePageSize,
  load,
  fetch,
  fetchConceptAncestors,
  fetchRelationships,
  fetchConceptAnyRelations,
};

export { searchParams };
