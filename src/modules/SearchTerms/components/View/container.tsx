import { connect } from 'react-redux';
import { Component } from 'react';
import actions from 'modules/SearchTerms/actions';
import { goBack } from 'react-router-redux';
import { get } from 'lodash';
import presenter from './presenter';
import selectors from './selectors';
import {
	ITermProps,
	ITermStateProps,
	ITermDispatchProps,
} from './presenter';

interface ITermRoute {
	routeParams: {
		termId: string;
	};
}

class Term extends Component<ITermProps, {}> {
	componentWillMount() {
		this.props.fetch(this.props.termId);
	}

	render() {
		return presenter(this.props);
	}
}

function mapStateToProps(state: Object, ownProps: ITermRoute): ITermStateProps {
	const isLoading = get(state, 'searchTerms.terms.isLoading', false);
	const termId = parseInt(ownProps.routeParams.termId, 0);
	const name = get(state, 'searchTerms.terms.data.name', 'Term');
	const details = get(state, 'searchTerms.terms.data', {});
	const connections = selectors.getConnections(state);

	return {
		connections,
		details,
		isLoading,
		name,
		termId,
	};
}

const mapDispatchToProps = {
	fetch: actions.termList.fetch,
	goBack: goBack,
};

export default connect<ITermStateProps, ITermDispatchProps, {}>(
	mapStateToProps,
	mapDispatchToProps
)(Term);
