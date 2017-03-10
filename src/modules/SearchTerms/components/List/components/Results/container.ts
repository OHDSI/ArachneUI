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
	SearchResult
} from './presenter';

class Results extends Component<IResultProps, {}> {
	render() {
		return presenter(this.props);
	}
}

function mapStateToProps(state: Object): IResultStateProps {
	const searchResults = selectors.getResults(state);
  const search = get(state, 'routing.locationBeforeTransitions');
  const downloadingEnabled = search.query.query && search.query.query.length > 3;
  const downloadLink = new URI();
  downloadLink.setSearch(search.query);
  // query should be 3 letters min
  if(!search.query.query || search.query.query.length < 3) {
  	downloadLink.removeSearch('query');
  }

	return {
		searchResults,
		sorting: {
			sortBy: selectors.getConceptFieldName(get(search, 'query.sort', '')),
			sortAsc: get(search, 'query.order') === 'asc',
		},
		search,
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
		setSorting: (sortParams) => {
      const currentAddress = new URI(`${stateProps.search.pathname}${stateProps.search.search}`);
      currentAddress.setSearch('sort', selectors.getConceptFieldId(sortParams.sortBy));
      currentAddress.setSearch('order', stateProps.sorting.sortAsc ? 'desc' : 'asc');
      dispatchProps.search(currentAddress.resource());
    },
	};
}

export default connect<IResultStateProps, IResultDispatchProps, IResultOwnProps>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(Results);
