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

import React from 'react';
import {Modal, Form, FormAutocomplete} from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';

require('./style.scss');

function ModalAddDataOwner(props) {
	const classes = new BEMHelper('ds-form-add-owner');

	const fields = [
		{
			name: 'username',
			InputComponent: {
				component: FormAutocomplete,
				props: {
					mods: ['bordered'],
					placeholder: 'Search by name',
					options: props.dataOwnerOptions,
					fetchOptions: props.loadDataOwnerOptions,
					clearable: false,
				}
			}
		},
	];

	const submitBtn = {
		label: 'Add',
		loadingLabel: 'Adding...',
		mods: ['success', 'rounded'],
	};

	const cancelBtn = {
		label: 'Cancel',
	};

	return (
		<Modal modal={props.modal} title="Add owner">
			<div {...classes()}>
				<Form
					mods="spacing-actions-sm"
					fields={fields}
					submitBtn={submitBtn}
					cancelBtn={cancelBtn}
					onSubmit={props.doSubmit}
					onCancel={props.modal.close}
					{...props}
				/>
			</div>
		</Modal>
	);
}

export default ModalAddDataOwner;