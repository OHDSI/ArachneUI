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

// @ts-check
import {Component, PropTypes} from 'react';
import {reset as resetForm} from 'redux-form';
import {ModalUtils} from 'arachne-ui-components';
import {ContainerBuilder, Utils, get} from 'services/Utils';
import actions from 'actions';
import {modal, forms} from 'modules/DataCatalog/const';
import presenter from './presenter';

/** @augments { Component<any, any> } */
export class ModalAddOwner extends Component {
	static get propTypes() {
		return {
			isOpened: PropTypes.bool,
			loadDataOwnerOptions: PropTypes.func,
		};
	}

	componentWillReceiveProps(props) {
		if (this.props.isOpened === false && props.isOpened === true) {
			this.props.loadDataOwnerOptions({
				query: '',
			});
		}
	}

	render() {
		return presenter(this.props);
	}
}

export default class ModalAddOwnerBuilder extends ContainerBuilder {
	getComponent() {
		return ModalAddOwner;
	}

	getFormParams() {
		return {
			form: forms.addDataOwner,
		};
	}

	getModalParams() {
		return {
			name: modal.addDataOwner,
		};
	}

	mapStateToProps(state) {
		const dataNodeId = get(state, 'dataCatalog.dataSource.data.result.dataNode.id');
		const ownerList = get(state, 'dataCatalog.dataNodeUsers.data', []);
		const ownerSuggestions = get(state, 'dataCatalog.dataNodeUserSuggestions.data') || [];
		const dataOwnerOptions = ownerSuggestions.slice(0, 10).map(user => ({
			label: `${user.firstname} ${user.lastname}`,
			value: user.username,
		}));

		return {
			dataNodeId,
			ownerList,
			isOpened: get(state, `modal.${modal.addDataOwner}.isOpened`, false),
			dataOwnerOptions,
		};
	}

	/**
	 * @returns { { [x: string]: any } }
	 */
	getMapDispatchToProps() {
		return {
			addDataOwner: actions.dataCatalog.dataNodeUsers.create,
			loadDataOwnerOptions: ({ query, excludeEmails }) => actions.dataCatalog.dataNodeUserSuggestions.find({ query, excludeEmails }),
			closeModal: () => ModalUtils.actions.toggle(modal.addDataOwner, false),
			resetForm: resetForm.bind(null, forms.addDataOwner),
			loadOwnerList: actions.dataCatalog.dataNodeUsers.find,
		};
	}

	mergeProps(stateProps, dispatchProps, ownProps) {
		return {
			...ownProps,
			...stateProps,
			...dispatchProps,
			async doSubmit({ username }) {
				await dispatchProps.addDataOwner(
					{ dataNodeId: stateProps.dataNodeId },
					{ userName: username }
				);

				await dispatchProps.resetForm();
				await dispatchProps.closeModal();
				await dispatchProps.loadOwnerList({ dataNodeId: stateProps.dataNodeId });
			},
			loadDataOwnerOptions: ({ query, excludeEmails }) => {
				query = query || '';
				excludeEmails = (excludeEmails || []).concat(stateProps.ownerList.map(o => o.email));
				return dispatchProps.loadDataOwnerOptions({query, excludeEmails});
			},
		};
	}
}
