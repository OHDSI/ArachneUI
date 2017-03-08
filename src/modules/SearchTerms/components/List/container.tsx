import { connect } from 'react-redux';
import { Component } from 'react';
import actions from 'modules/SearchTerms/actions';
import presenter from './presenter';
import {
	ISearchTermProps,
} from './presenter';

interface ISearchTermDispatchProps {
	loadTerms: Function,
}

class List extends Component<ISearchTermProps & ISearchTermDispatchProps, {}> {
	componentWillMount() {
		this.props.loadTerms();
	}

	render() {
		return presenter(this.props);
	}
}

function mapStateToProps(state: Object): ISearchTermProps {
	return {
		isLoading: state.searchTerms.posts.isLoading,
	};
}

const mapDispatchToProps = {
	loadTerms: actions.termList.load,
};

export default connect<ISearchTermProps, ISearchTermDispatchProps, {}>(
	mapStateToProps,
	mapDispatchToProps
)(List);
