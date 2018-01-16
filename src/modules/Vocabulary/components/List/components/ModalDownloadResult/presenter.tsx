import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import { Modal, Link } from 'arachne-ui-components';
import { paths } from 'modules/Vocabulary/const';

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
		    	Vocabularies are being prepared now.
		    	As soon as they are ready, you will receive an email.
		    	Also it will be possible to download vocabularies from the Download History page.
	    	</p>
	    	<Link {...classes('history-link')} to={paths.history()}>Show history</Link>
	    </div>
    </Modal>);
}

export default ModalDownloadResult;