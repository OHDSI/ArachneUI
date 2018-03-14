/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
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
 * Created: january 22, 2018
 *
 */

import { Component } from 'react';
import actions from 'actions';
import { ContainerBuilder, get, Utils } from 'services/Utils';
import { searchSections, searchResultsPageSize } from 'modules/Portal/const';
import { extractPaginationData } from 'components/Grid';
import isEqual from 'lodash/isEqual';
import presenter from './presenter';
//import SelectorsBuiler from './selectors';

//const selectors = (new SelectorsBuilder()).build();
const defaultParams = {
  query: '',
  page: 1,
  pageSize: searchResultsPageSize,
};

class SearchResults extends Component {
  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.searchParams, nextProps.searchParams)) {
      this.props.search(nextProps.searchParams);
    }
  }

  searchQueryDecode({ searchParams, filterFields }) {
    const filter = get(searchParams, 'filter.domain', {}, 'Object');
    return {
      query: searchParams.query,
      filter: {
        domain: Object.values(filter),
      },
    };
  }

  render() {
    return presenter({
      ...this.props,
      searchQueryDecode: this.searchQueryDecode,
    });
  }
}

export default class SearchResultsBuilder extends ContainerBuilder {
  getComponent() {
    return SearchResults;
  }

  mapStateToProps(state) {
    const searchResults = get(state, 'portal.search.queryResult.result.content', [], 'Array');
    const search = get(state, 'routing.locationBeforeTransitions.search', '', 'String');
    const query = get(state, 'routing.locationBeforeTransitions.query.query', '', 'String');
    const numOfElsPerPage = searchResultsPageSize;
    const searchParams = this.getSearchParams(search, query);

    return {
      paginationDetails: extractPaginationData({ searchResults, numOfElsPerPage }),
      filterFields: searchSections,
      searchParams,
    };
  }

  getMapDispatchToProps() {
    return {
      search: actions.portal.search.query,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
    };
  }

  getSearchParams(search, query) {
    const searchParams = Utils.getFilterValues(search);

    return { ...defaultParams, ...searchParams, query };
  }

  getFetchers({ params, state, dispatch }) {
    const search = get(state, 'routing.locationBeforeTransitions.search', '', 'String');
    const query = get(state, 'routing.locationBeforeTransitions.query.query', '', 'String');

     return {
       search: () => actions.portal.search.query(this.getSearchParams(search, query)),
     };
  }
}
