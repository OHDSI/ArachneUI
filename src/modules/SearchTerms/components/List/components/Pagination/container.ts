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

import { connect } from 'react-redux';
import { Component } from 'react';
import { get } from 'lodash';
import { resultsPageSize, maxResultsPageSize, paths } from 'modules/SearchTerms/const';
import * as numeral from 'numeral';
import actions from 'modules/SearchTerms/actions';
import { push as goToPage } from 'react-router-redux';
import * as URI from 'urijs';
import { locationDescriptor } from 'modules/SearchTerms/components/List/presenter';
import presenter from './presenter';
import {
  IPaginationProps,
  IPaginationStateProps,
  IPaginationDispatchProps,
  IPaginationOwnProps,
  IPageSizeSelectOption,
} from './presenter';


class Pagination extends Component<IPaginationProps, void> {
  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: Object, ownProps: IPaginationOwnProps): IPaginationStateProps {
  const pageSize = get(state, 'routing.locationBeforeTransitions.query.pageSize') ||
    get(state, 'searchTerms.termList.data.pageSize') ||
    resultsPageSize;
  const pages = get(state, 'searchTerms.terms.queryResult.totalPages', 0);
  const currentPage = parseInt(get(state, 'routing.locationBeforeTransitions.query.page', '1'), 0);
  const path: locationDescriptor = get(state, 'routing.locationBeforeTransitions', {
    pathname: paths.termsList(),
    search: '',
  });
  const totalCount = numeral(get(state, 'searchTerms.terms.queryResult.totalElements', 0))
    .format('0,0');
  const pageSizeSelectOptions: Array<IPageSizeSelectOption> = [
    {
      label: '15',
      value: 15
    },
    {
      label: '30',
      value: 30
    },
    {
      label: '50',
      value: 50
    },
    {
      label: '100',
      value: 100
    },
    {
      label: '500',
      value: 500
    },
  ];

  return {
    currentPage,
    pages,
    path: path.pathname + path.search,
    pageSizeSelectOptions,
    pageSize: parseInt(pageSize.toString(), 0),
    // to be used in changePageSize
    locationSearch: path,
    totalCount,
  };
}

const mapDispatchToProps = {
  search: (address: string) => goToPage(address),
  changePageSize: actions.termList.changePageSize,
};

function mergeProps(
    stateProps: IPaginationStateProps,
    dispatchProps: IPaginationDispatchProps,
    ownProps: IPaginationOwnProps
  ): IPaginationProps {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    changePageSize: (pageSize: number) => {
      const currentAddress = new URI(`${stateProps.locationSearch.pathname}${stateProps.locationSearch.search}`);
      dispatchProps.changePageSize(pageSize);
      currentAddress.setSearch('pageSize', pageSize);
      currentAddress.setSearch('page', 1);
      return dispatchProps.search(currentAddress.href());
    },
  };
}

export default connect<IPaginationStateProps, IPaginationDispatchProps, IPaginationOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
 )(Pagination);
