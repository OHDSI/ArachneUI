import { connect } from 'react-redux';
import { Component } from 'react';
import actions from 'modules/SearchTerms/actions';
import { get } from 'lodash';
import presenter from './presenter';
import { resultsPageSize } from 'modules/SearchTerms/const';
import * as URI from 'urijs';
import {
	ISearchTermProps,
} from './presenter';

interface ISearchTermDispatchProps {
	loadTerms: Function,
}

class List extends Component<ISearchTermProps & ISearchTermDispatchProps, {}> {
	componentWillMount() {
		this.props.loadTerms(URI.parseQuery(this.props.searchStr));
	}

	componentWillReceiveProps(props: ISearchTermProps) {
		if (this.props.searchStr !== props.searchStr) {
      this.props.loadTerms(URI.parseQuery(props.searchStr));
    }
	}

	render() {
		return presenter(this.props);
	}
}

function mapStateToProps(state: Object): ISearchTermProps {

	return {
    searchStr: get(state, 'routing.locationBeforeTransitions.search', ''),
		isLoading: get(state, 'searchTerms.terms.isLoading', false),
	};
}

const mapDispatchToProps = {
	loadTerms: actions.termList.load,
};

export default connect<ISearchTermProps, ISearchTermDispatchProps, {}>(
	mapStateToProps,
	mapDispatchToProps
)(List);
