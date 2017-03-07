import { connect } from 'react-redux';
import { Component } from 'react';
import actions from 'modules/SearchTerms/actions';
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

	return {
		searchResults,
	};
}

const mapDispatchToProps = {};

function mergeProps(
	stateProps: IResultStateProps,
	dispatchProps: IResultDispatchProps,
	ownProps: IResultOwnProps
): IResultProps {
	return {
		...stateProps,
		...dispatchProps,
		...ownProps,
		download: () => {},
		showResult: () => {},
	};
}

export default connect<IResultStateProps, IResultDispatchProps, IResultOwnProps>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps
)(Results);
