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
import actions from 'modules/SearchTerms/actions';
import { apiPaths } from 'modules/SearchTerms/const';
import { get } from 'lodash';
import * as URI from 'urijs';
import { push as goToPage } from 'react-router-redux';
import presenter from './presenter';
import selectors from './selectors';
import {
	IResultStateProps,
	IResultDispatchProps,
	IResultOwnProps,
	IResultProps,
	SortingParams,
} from './presenter';

class Results extends Component<IResultProps, {}> {
	render() {
		return presenter(this.props);
	}
}

function mapStateToProps(state: Object): IResultStateProps {
  const searchResults = selectors.getResults(state);
  const debugResults  = selectors.getDebugResults(state);
  const queryResults  = selectors.getQueryResults(state);
  const searchLocation = get(state, 'routing.locationBeforeTransitions', {
  	pathname: '',
  	search: '',
  	query: {
  		query: '',
  	},
  });
  const downloadingEnabled = searchLocation.query.query && searchLocation.query.query.length > 3;
  const downloadLink = new URI();
  downloadLink.setSearch(searchLocation.query);
  // query should be 3 letters min
  if(!searchLocation.query.query || searchLocation.query.query.length < 3) {
  	downloadLink.removeSearch('query');
	}
	const sortBy = get(searchLocation, 'query.sort', 'id');

	return {
		searchResults,
		sorting: {
			sortBy: selectors.getConceptFieldName(sortBy) || sortBy, // use fallback when sorting is set to static fields like id
			sortAsc: get(searchLocation, 'query.order') === 'asc',
		},
		searchLocation,
		downloadLink: apiPaths.downloadCsv(downloadLink.search()),
		downloadingEnabled,
	};
}

const mapDispatchToProps = {
	search: (address: string) => goToPage(address),
};

function mergeProps(
	stateProps: IResultStateProps,
	dispatchProps: IResultDispatchProps,
	ownProps: IResultOwnProps
): IResultProps {
	return {
		...stateProps,
		...dispatchProps,
		...ownProps,
		showResult: () => {},
		setSorting: (sortParams: SortingParams) => {
      const currentAddress = new URI(`${stateProps.searchLocation.pathname}${stateProps.searchLocation.search}`);
      currentAddress.setSearch('sort', selectors.getConceptFieldId(sortParams.sortBy));
      currentAddress.setSearch('order', stateProps.sorting.sortAsc ? 'desc' : 'asc');
      dispatchProps.search(currentAddress.href());
    },
	};
}

export default connect<IResultStateProps, IResultDispatchProps, IResultOwnProps>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(Results);
