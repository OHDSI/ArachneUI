import { connect } from 'react-redux';
import { Component } from 'react';
import { get } from 'lodash';
import { resultsPageSize, maxResultsPageSize, paths } from 'modules/SearchTerms/const';
import * as numeral from 'numeral';
import actions from 'modules/SearchTerms/actions';
import { push as goToPage } from 'react-router-redux';
import * as URI from 'urijs';
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
  const pageSize = parseInt(get(state, 'routing.locationBeforeTransitions.query.pageSize', '1')) ||
    get(state, 'searchTerms.termList.data.pageSize') ||
    resultsPageSize;
  const pages = get(state, 'searchTerms.terms.queryResult.totalPages', 0);
  const currentPage = parseInt(get(state, 'routing.locationBeforeTransitions.query.page', '1'), 0);
  const path = get(state, 'routing.locationBeforeTransitions') || {
    pathname: paths.termsList(),
    search: '',
  };
  const pageSizeSelectOptions = new Array<IPageSizeSelectOption>();
  for(
    let label = resultsPageSize;
    label <= maxResultsPageSize;
    label+=1) {
    pageSizeSelectOptions.push({
      value: label,
      label,
    });
  }
  const search = get(state, 'routing.locationBeforeTransitions');

  return {
    currentPage,
    pages,
    path: path.pathname + path.search,
    pageSizeSelectOptions,
    pageSize,
    // to be used in changePageSize
    search,
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
      const currentAddress = new URI(`${stateProps.search.pathname}${stateProps.search.search}`);
      dispatchProps.changePageSize(pageSize);
      currentAddress.setSearch('pageSize', pageSize);
      currentAddress.setSearch('page', 1);
      dispatchProps.search(currentAddress.resource());
    },
  };
}

export default connect<IPaginationStateProps, IPaginationDispatchProps, IPaginationOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
 )(Pagination);
