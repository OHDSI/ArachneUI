/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexandr Saltykov, Pavel Grafkin, Vitaly Koulakov, Anton Gackovka
 * Created: March 3, 2017
 *
 */

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
		window.opener.postMessage({
			data: this.props.authToken,
			type: 'loginResult',
		}, get(window, 'location.origin'));
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
