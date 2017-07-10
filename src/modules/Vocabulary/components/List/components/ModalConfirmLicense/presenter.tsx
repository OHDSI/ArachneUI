import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import { Modal, Link } from 'arachne-components';
import { paths } from 'modules/Vocabulary/const';

require('./style.scss');

function ModalConfirmLicense(props) {
	const {
		modal,
	} = props;
	const classes = BEMHelper('modal-confirm-license');

  return (
    <Modal modal={modal} title='Request access'>
	    <div {...classes()}>
	    	Your request will be reviewed soon. After that you will receive a notification 
	    </div>
    </Modal>);
}

export default ModalConfirmLicense;