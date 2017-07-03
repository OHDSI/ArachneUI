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

class DownloadHistory extends Component<IDownloadHistoryProps, { expandedBundleId: number }> {
	constructor() {
		super();
		this.state = {
			expandedBundleId: 0,
		};
		this.toggle = this.toggle.bind(this);
	}

	componentWillMount() {
		this.props.load();
	}

	toggle(bundleId) {
		this.setState({
			expandedBundleId: this.state.expandedBundleId !== bundleId ? bundleId : -1,
		});
	}

	render() {
		return presenter({
			...this.props,
			expandedBundleId: this.state.expandedBundleId,
			toggle: this.toggle,
		});
	}
}

function mapStateToProps(state: Object): IDownloadHistoryStateProps {
	const history = selectors.getHistory(state);

	return {
		isLoading: get(state, 'vocabulary.history.isLoading', false)
			|| get(state, 'vocabulary.restore.isSaving', false),
		history,
	};
}

const mapDispatchToProps = {
	load: actions.history.load,
	remove: actions.history.remove,
	restore: actions.history.restore,
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
		restoreBundle: (id) => {
			dispatchProps
				.restore(id)
				.then(dispatchProps.load);
		},
	};
}

export default connect<IDownloadHistoryStateProps, IDownloadHistoryDispatchProps, void>(
	mapStateToProps,
	mapDispatchToProps,
	mergeProps,
)(DownloadHistory);
