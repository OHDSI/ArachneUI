import { connect } from 'react-redux';
import { Component } from 'react';
import actions from 'modules/SearchTerms/actions';
import { goBack } from 'react-router-redux';
import { get } from 'lodash';
import presenter from './presenter';
import {
	ITermProps,
	ITermStateProps,
	ITermDispatchProps,
} from './presenter';

interface ITermRoute {
	routeParams: {
		termId: string;
		displayMode?: string;
	};
}

class Term extends Component<ITermProps, {}> {
	componentWillMount() {
		this.props.fetch(this.props.termId);
		this.props.fetchRelations(this.props.termId);
		this.props.fetchRelationships(this.props.termId);
	}

  componentWillReceiveProps(props: ITermProps) {
    if (this.props.termId !== props.termId) {
			this.props.fetch(props.termId);
      this.props.fetchRelations(props.termId);
		this.props.fetchRelationships(props.termId);
    }
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
	const isTableMode = ownProps.routeParams.displayMode === 'table';
	const isStandard = get(details, 'standardConcept') === 'Standard';

	return {
		details,
		isLoading,
		name,
		termId,
		isTableMode,
		isStandard,
	};
}

const mapDispatchToProps = {
	fetch: actions.termList.fetch,
	fetchRelations: actions.termList.fetchRelations,
	goBack,
  fetchRelationships: actions.termList.fetchRelationships,
};

export default connect<ITermStateProps, ITermDispatchProps, {}>(
	mapStateToProps,
	mapDispatchToProps
)(Term);
