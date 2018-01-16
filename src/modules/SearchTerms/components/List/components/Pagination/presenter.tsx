import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Pagination,
  Select,
} from 'arachne-ui-components';
import { locationDescriptor } from 'modules/SearchTerms/components/List/presenter';
import { push } from 'react-router-redux';

require('./style.scss');

type IPageSizeSelectOption = {
  value: number | string,
  label: number | string,
}

interface IPaginationStateProps {
  currentPage: number;
  pages: number;
  path: string;
  pageSizeSelectOptions: IPageSizeSelectOption[];
  pageSize: number;
  locationSearch: locationDescriptor;
  totalCount: string;
};

interface IPaginationDispatchProps {
  search: (address: string) => typeof push;
  changePageSize: (pageSize: number) => (dispatch: Function) => any;
};

interface IPaginationOwnProps {
  resultsCount: number;
};

interface IPaginationProps
  extends IPaginationStateProps, IPaginationDispatchProps, IPaginationOwnProps {}

function Pages(props: IPaginationProps) {
  const {
    changePageSize,
    currentPage,
    pages,
    pageSize,
    pageSizeSelectOptions,
    path,
    totalCount,
  } = props;
  const classes = BEMHelper('search-pagination');

  return (
    <div {...classes()}>
      Show by <Select
        {...classes('page-size-select')}
        mods={['rounded', 'bordered']}
        options={pageSizeSelectOptions}
        value={pageSize}
        onChange={changePageSize}
      /> items
      <span {...classes('total')}>
        Total {totalCount} items
      </span>
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
  IPaginationOwnProps,
  locationDescriptor,
};
