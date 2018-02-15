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
import { get } from 'services/Utils';
import actions from 'actions';
import { ContainerBuilder } from 'services/Utils';
import { searchSections, searchResultsPageSize } from 'modules/Portal/const';
import { extractPaginationData } from 'components/Grid';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import presenter from './presenter';
//import SelectorsBuiler from './selectors';

//const selectors = (new SelectorsBuilder()).build();
const defaultParams = {
  query: '',
};

class SearchResults extends Component {
  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.searchParams, nextProps.searchParams)) {
      this.props.search(nextProps.searchParams);
    }
  }

  render() {
    return presenter(this.props);
  }
}

export default class SearchResultsBuilder extends ContainerBuilder {
  getComponent() {
    return SearchResults;
  }

  mapStateToProps(state) {
    // TODO: sanitize query
    const searchResults = get(state, 'portal.search.queryResult.result.content', [], 'Array');
    let searchParams = get(state, 'routing.locationBeforeTransitions.query');
    const numOfElsPerPage = searchResultsPageSize;
    searchParams = isEmpty(searchParams) ? defaultParams : searchParams;

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

  getFetchers({ params, state, dispatch }) {
    const searchParams = get(state, 'routing.locationBeforeTransitions.query');

     return {
       search: () => actions.portal.search.query(isEmpty(searchParams) ? defaultParams : searchParams),
     };
  }
}
