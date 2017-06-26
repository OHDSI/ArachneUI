import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
	Modal,
	FormCheckboxList,
	Form,
} from 'arachne-components';

require('./style.scss');

function ModalEditPermissions(props) {
  const {
    modal,
    vocabularies,
    user,
    doSubmit,
  } = props;
  const classes = BEMHelper('edit-permissions');
  const fields = [{
  	name: 'vocabularies',
  	InputComponent: {
  		component: FormCheckboxList,
  		props: {
  			options: vocabularies,
  		},
  	},
  }];
	const submitBtn = {
		label: 'Save',
		labelSubmitting: 'Saving',
	};

  return (
    <Modal modal={modal} title={`Edit permissions for user ${user}`}>
	    <ul {...classes()}>
	    	<Form
	    		onSubmit={doSubmit}
	    		fields={fields}
	    		submitBtn={submitBtn}
	    		{...props}
	    	/>
	    </ul>
    </Modal>);
}

export default ModalEditPermissions;
