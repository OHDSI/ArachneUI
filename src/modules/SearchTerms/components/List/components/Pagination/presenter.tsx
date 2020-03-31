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
        unselectable={false}
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
