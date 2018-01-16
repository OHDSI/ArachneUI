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