import { connect } from 'react-redux';
import { Component } from 'react';
import actions from 'modules/Vocabulary/actions';
import { get } from 'lodash';
import presenter from './presenter';
import { resultsPageSize } from 'modules/Vocabulary/const';
import * as URI from 'urijs';

import {
	IListStateProps,
	IListDispatchProps,
	IListProps,
} from './presenter';

class VocabsList extends Component<IListProps, void> {
	componentWillMount() {
		this.props.load();
	}

	render() {
		return presenter(this.props);
	}
}

function mapStateToProps(state: Object): IListStateProps {

	return {
		isLoading: get(state, 'vocabulary.vocabularies.isLoading', false),
	};
}

const mapDispatchToProps = {
	load: actions.vocabularies.load,
};

export default connect<IListStateProps, IListDispatchProps, void>(
	mapStateToProps,
	mapDispatchToProps
)(VocabsList);
