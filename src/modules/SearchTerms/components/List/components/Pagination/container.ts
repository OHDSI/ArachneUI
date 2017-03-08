import { connect } from 'react-redux';
import { Component } from 'react';
import { get } from 'lodash';
import { resultsPageSize, paths } from 'modules/SearchTerms/const';
import * as numeral from 'numeral';
import actions from 'modules/SearchTerms/actions';
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
  const pageSize = get(state, 'searchTerms.termList.data.pageSize', resultsPageSize);
  const pages = get(state, 'searchTerms.termList.data.totalPages', 18);
  const currentPage = parseInt(get(state, 'routing.locationBeforeTransitions.query.page', '1'), 0);
  const path = get(state, 'routing.locationBeforeTransitions') || {
    pathname: paths.termsList(),
    search: '',
  };
  const totalItems = 14691;

  // select options
  const { resultsCount } = ownProps;
  // front pagination is 1-based, back pagination is 0-based
  const shownItemsFrom = (currentPage-1) * pageSize + 1;
  const shownItemsTo = shownItemsFrom + resultsCount;
  const pageSizeSelectOptions = new Array<IPageSizeSelectOption>();
  for(
    let label = shownItemsTo, value = resultsPageSize;
    label < shownItemsTo + resultsPageSize;
    label+=1, value+=1) {
    pageSizeSelectOptions.push({
      value,
      label,
    });
  }

  return {
    currentPage,
    pages,
    path: path.pathname + path.search,
    shownItemsFrom: numeral(shownItemsFrom).format('0[,]0'),
    shownItemsTo,
    totalItems: numeral(totalItems).format('0[,]0'),
    pageSizeSelectOptions,
    pageSize,
  };
}

const mapDispatchToProps = {
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
    changePageSize: (pageSize: number) => dispatchProps.changePageSize(pageSize),
  };
}

export default connect<IPaginationStateProps, IPaginationDispatchProps, IPaginationOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
 )(Pagination);
