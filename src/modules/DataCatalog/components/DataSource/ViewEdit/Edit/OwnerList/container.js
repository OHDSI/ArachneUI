/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Authors: Pavel Grafkin
 * Created: April 26, 2019
 *
 */

import {Component, PropTypes} from 'react';
import actions from 'actions';
import {ContainerBuilder, get} from 'services/Utils';
import {userInfoConvert} from 'components/LabelUser';
import presenter from './presenter';
import {modal} from 'modules/DataCatalog/const';
import {ModalUtils} from "arachne-ui-components";
import { executionPolicy } from 'const/dataSource';

/** @augments { Component<any, any> } */
export class UsersList extends Component {
	static get propTypes() {
		return {
			dataNodeId: PropTypes.number,
			load: PropTypes.func,
		};
	}

	componentWillMount() {
		if (this.props.dataNodeId) {
			this.props.load({dataNodeId: this.props.dataNodeId});
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.dataNodeId !== nextProps.dataNodeId) {
			this.props.load({dataNodeId: this.props.dataNodeId});
		}
	}

	render() {
		return presenter(this.props);
	}
}

export default class UsersListBuilder extends ContainerBuilder {
	getComponent() {
		return UsersList;
	}

	mapStateToProps(state) {
		const dataNodeId = get(state, 'dataCatalog.dataSource.data.result.dataNode.id');
		const userList = get(state, 'dataCatalog.dataNodeUsers.data') || [];

		let isManualSource = false;
		const execPolicy = get(state, 'dataCatalog.dataSource.data.result.executionPolicy', '');

		if (dataNodeId) { // If data is loaded
			if (!execPolicy) { // By default, we assume that DS is Manual
				isManualSource = true;
			} else { // If there is info on executionPolicy provided - check the type
				isManualSource = execPolicy === executionPolicy.MANUAL;
			}
		}

		return {
			dataNodeId,
			isManualSource,
			userList: userList.map(u => userInfoConvert(u)),
			isLoading: get(state, 'dataCatalog.dataNodeUsers.isLoading') || false,
		};
	}

	getMapDispatchToProps() {
		return {
			load: actions.dataCatalog.dataNodeUsers.find,
			openModal: () => ModalUtils.actions.toggle(modal.addDataOwner, true),
			removeDataOwner: actions.dataCatalog.dataNodeUsers.delete,
		};
	}

	mergeProps(stateProps, dispatchProps, ownProps) {
		return {
			...ownProps,
			...stateProps,
			...dispatchProps,
			async removeDataOwner({ username }) {
				if (stateProps.userList.length < 2) {
					alert('Cannot remove last owner');
					return;
				}
				await dispatchProps.removeDataOwner(
					{ dataNodeId: stateProps.dataNodeId },
					{ userName: username }
				);
				await dispatchProps.load({ dataNodeId: stateProps.dataNodeId });
			}
		};
	}
}
