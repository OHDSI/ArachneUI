import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import { Modal } from 'arachne-components';

function ModalDownloadResult(props) {
	const {
		modal,
	} = props;

  return (
    <Modal modal={modal} title='Download summary'>
    	You can now download these vocabularies on the history page
    </Modal>);
}

export default ModalDownloadResult;