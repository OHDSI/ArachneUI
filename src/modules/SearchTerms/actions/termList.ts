import API from 'services/Api';
import services from '../apiServices';

import { actionTypes } from 'modules/SearchTerms/const';
import { IAppAction } from 'actions';

type searchParams = {
  sort?: string;
  order?: string;

  pageSize: number;
  page?: number;

  query?: string;
  vocabulary?: string;
  domain?: string;
  conceptClass?: string;
  standardConcept?: string;
  invalidReason?: string;
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
  return (dispatch: Function) => dispatch(pageSizeUpdated(pageSize));
}

function load(params: searchParams) {
	return services.terms.find({ query: params });
}

export default {
  changePageSize,
  load,
};
