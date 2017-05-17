import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import { Modal } from 'arachne-components';

require('./style.scss');

function ModalDownloadResult(props) {
	const {
		modal,
	} = props;
	const classes = BEMHelper('modal-download-result');

  return (
    <Modal modal={modal} title='Download summary'>
	    <div {...classes()}>
	    	<p {...classes('text')}>
		    	Vocabularies are being prepared now.<br/>
		    	As soon as they are ready, you will receive an email.<br/>
		    	Also it will be possible to download vocabularies from the Download History page.
	    	</p>
	    </div>
    </Modal>);
}

export default ModalDownloadResult;