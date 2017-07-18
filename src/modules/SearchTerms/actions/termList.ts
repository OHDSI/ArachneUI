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
  return services.relations.get(conceptId, {query: {depth: levels, zoomLevel}});
}

function fetchRelationships(conceptId: number, standards = false) {
  return services.relationships.get(conceptId, {query: {std: standards}});
}

export default {
  changePageSize,
  load,
  fetch,
  fetchConceptAncestors,
  fetchRelationships,
};

export { searchParams };
