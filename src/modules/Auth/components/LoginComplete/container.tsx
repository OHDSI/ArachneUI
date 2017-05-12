import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import * as get from 'lodash/get';
import actions from 'modules/Auth/actions';

interface ILoginCompleteState {
	authToken: string;
}

interface ILoginCompleteDispatch {
	setAuthToken: Function;
}

interface ILoginCompleteProps extends ILoginCompleteState, ILoginCompleteDispatch {};

class LoginComplete extends Component<ILoginCompleteProps, {}> {
	componentWillMount() {
		this.props.setAuthToken(this.props.authToken);
		window.opener.onAuthDone();
		window.close();
	}

	render() {
		return (
			<div>
				{this.props.authToken ?
					<span>You have successfuly logged in. Close the window and refresh page.</span>
					:
					<span>An error occured. Try once more.</span>
				}
			</div>
		);
	}
}

function mapStateToProps(state: any): ILoginCompleteState {
	return {
		authToken: get(state, 'routing.locationBeforeTransitions.query.token'),
	} as ILoginCompleteState;
}

const mapDispatchToProps = {
	setAuthToken: actions.core.setToken,
};

export default connect<ILoginCompleteState, Object, {}>(
	mapStateToProps,
	mapDispatchToProps
)(LoginComplete);
