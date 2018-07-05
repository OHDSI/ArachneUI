/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
import BEMHelper from 'services/BemHelper';
import {
	Modal,
	Form,
	FormSelect,
	FormAutocomplete,
	FormCheckboxListFilterable,
} from 'arachne-ui-components';
import { paths } from 'modules/Vocabulary/const';

require('./style.scss');

function ModalAddPermission(props) {
	const {
		doSubmit,
		getUsers,
		modal,
		users,
		vocabularies,
	} = props;
	const classes = BEMHelper('modal-add-permission');
	const fields = [
		{
			name: 'user',
			InputComponent: {
				component: FormAutocomplete,
				props: {
					placeholder: 'User',
					mods: ['bordered'],
					autocomplete: true,
					fetchOptions: getUsers,
					options: users,
				},
			},
		},
		{
			name: 'vocabulary',
			InputComponent: {
				component: FormCheckboxListFilterable,
				props: {
					...classes('select'),
					options: vocabularies,
			    hasFilter: true,
			    filterText: 'Vocabularies',
			    searchField: 'label',
				},
			},
		},
	];

	const submitBtn = {
		label: 'Add',
		labelSubmitting: 'Adding',
	};

  return (
    <Modal modal={modal} title='Add permission'>
	    <div {...classes()}>
	    	<Form
		    	onSubmit={doSubmit}
		    	fields={fields}
		    	submitBtn={submitBtn}
		    	{...props}
	    	/>
	    </div>
    </Modal>);
}

export default ModalAddPermission;