import { actionTypes } from 'modules/SearchTerms/const';
import { IAppAction } from 'actions';

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

export default {
  changePageSize,
};
