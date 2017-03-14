import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Pagination,
  Select,
} from 'arachne-components';
import { locationDescriptor } from 'modules/SearchTerms/components/List/presenter';
import { push } from 'react-router-redux';

require('./style.scss');

type IPageSizeSelectOption = {
  value: number,
  label: number,
}

interface IPaginationStateProps {
  currentPage: number;
  pages: number;
  path: string;
  pageSizeSelectOptions: IPageSizeSelectOption[];
  pageSize: number;
  locationSearch: locationDescriptor;
};

interface IPaginationDispatchProps {
  search: (address: string) => typeof push;
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
