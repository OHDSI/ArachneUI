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


class Pagination extends Component<IPaginationStateProps & IPaginationDispatchProps, void> {
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
  const totalCount = get(state, 'searchTerms.terms.queryResult.totalElements', 0);
  const pageSizeSelectOptions: Array<IPageSizeSelectOption> = [
    {
      label: 15,
      value: 15
    },
    {
      label: 30,
      value: 30
    },
    {
      label: 50,
      value: 50
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
      return dispatchProps.search(currentAddress.resource());
    },
  };
}

export default connect<IPaginationStateProps, IPaginationDispatchProps, IPaginationOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
 )(Pagination);
