import { connect } from 'react-redux';
import { Component } from 'react';
import actions from 'modules/Vocabulary/actions';
import { get } from 'lodash';
import presenter from './presenter';
import selectors from './selectors';

import {
	IDownloadHistoryStateProps,
	IDownloadHistoryDispatchProps,
	IDownloadHistoryProps,
} from './presenter';

class DownloadHistory extends Component<IDownloadHistoryProps, void> {
	componentWillMount() {
		this.props.load();
	}

	render() {
		return presenter(this.props);
	}
}

function mapStateToProps(state: Object): IDownloadHistoryStateProps {
	const history = selectors.getHistory(state);

	return {
		isLoading: get(state, 'vocabulary.history.isLoading', false),
		history,
	};
}

const mapDispatchToProps = {
	load: actions.history.load,
	remove: actions.history.remove,
};

function mergeProps(
	stateProps: IDownloadHistoryStateProps,
	dispatchProps: IDownloadHistoryDispatchProps
): IDownloadHistoryProps {
	return {
		...stateProps,
		...dispatchProps,
		removeBundle: (id: number) => {
			dispatchProps
				.remove(id)
				.then(dispatchProps.load);
		},
	};
}

export default connect<IDownloadHistoryStateProps, IDownloadHistoryDispatchProps, void>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps,
)(DownloadHistory);
