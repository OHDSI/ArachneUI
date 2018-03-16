import { get } from './Utils';

export default class PageableUtils {

  static getSorting(state, defaultSortField = 'name', defaultSortOrder = PageableUtils.SORT_ASC) {
    const location = state.routing.locationBeforeTransitions;
    const sort = get(location, 'query.sort', `${defaultSortField},${defaultSortOrder}`, 'string').split(',');

    return {
      sortBy: sort[0],
      sortAsc: sort[1] === PageableUtils.SORT_ASC,
    };
  }

  static setSorting(search, query, sortParams) {
    const searchParams = {
      ...query,
      sort: (sortParams.sortBy + ',' + (sortParams.sortAsc ? PageableUtils.SORT_ASC : PageableUtils.SORT_DESC)),
    };
    search(searchParams);
  }

}

PageableUtils.SORT_ASC = 'asc';
PageableUtils.SORT_DESC = 'desc';
