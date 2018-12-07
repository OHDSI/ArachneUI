/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: September 29, 2017
 *
 */

// @ts-check
import { Component } from 'react';
import { get, ContainerBuilder } from 'services/Utils';
import Uri from 'urijs';
import GridPresenter from './presenter';

function extractPaginationData({ searchResults, numOfElsPerPage, startsFromOne = false }) {
  const pages = get(searchResults, 'totalPages', 1);
  const currentPage = parseInt(get(searchResults, 'number', 1) + (startsFromOne ? 0 : 1), 10);
  const totalResults = get(searchResults, 'totalElements', 0);
  const showing = numOfElsPerPage; // get(searchResults, 'numberOfElements', 0);
  let pageStart = currentPage - 1;
  pageStart *= showing;

  return {
    pages,
    currentPage,
    totalResults,
    showing,
    pageStart,
  };
}

class Grid extends Component {
  
  componentWillReceiveProps(nextProps) {
    const currentPage = parseInt(nextProps.currentPage, 10);
    if (nextProps.paginationDetails.pages < currentPage && currentPage !== 1) {
      this.props.onPageOutOfRange(nextProps.currentPage, nextProps.paginationDetails.pages);
    }
  }
  
  render() {
    return GridPresenter({
      ...this.props,
    });
  }
}

export default class GridBuilder extends ContainerBuilder {

  getComponent() {
    return Grid;
  }

  mapStateToProps(state) {
    const cleanPath = get(state, 'routing.locationBeforeTransitions.pathname');
    const currentQuery = state.routing.locationBeforeTransitions.query;

    const url = new Uri(cleanPath);
    url.setSearch(currentQuery);

    return {
      path: url.href(),
      currentPage: currentQuery.page,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...dispatchProps,
      onPageOutOfRange(requestedPage, pagesCount) {
        console.warn(`Page ${requestedPage} is out of range [0..${pagesCount}]`);
      },
      ...ownProps, // allow re-defining of the onPagesOutOfRange handler
    };
  }

}

export {
  extractPaginationData,
};
