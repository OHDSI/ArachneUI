import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Pagination,
  Select,
} from 'arachne-components';

require('./style.scss');

type IPageSizeSelectOption = {
  value: number,
  label: number,
}

interface IPaginationStateProps {
  currentPage: number;
  pages: number;
  path: string;
  shownItemsFrom: string;
  shownItemsTo: number;
  totalItems: string;
  pageSizeSelectOptions: IPageSizeSelectOption[];
  pageSize: number;
};

interface IPaginationDispatchProps {
  changePageSize: (pageSize: number) => (dispatch: Function) => any;
};

interface IPaginationOwnProps {
  resultsCount: number;
};

interface IPaginationProps extends IPaginationStateProps, IPaginationDispatchProps {
}

function Pages(props: IPaginationProps) {
  const {
    changePageSize,
    currentPage,
    pages,
    pageSize,
    pageSizeSelectOptions,
    path,
    shownItemsFrom,
    shownItemsTo,
    totalItems,
  } = props;
  const classes = BEMHelper('search-pagination');

  return (
    <div {...classes()}>
      Showing {shownItemsFrom} to
      <Select
        {...classes('page-size-select')}
        mods={['rounded', 'bordered']}
        options={pageSizeSelectOptions}
        value={pageSize}
        onChange={changePageSize}
      /> of {totalItems} results.
      <Pagination pages={pages} currentPage={currentPage} path={path} />
    </div>
    );
}

export default Pages;
export {
  IPaginationProps,
  IPaginationStateProps,
  IPaginationDispatchProps,
  IPageSizeSelectOption,
  IPaginationOwnProps
};
