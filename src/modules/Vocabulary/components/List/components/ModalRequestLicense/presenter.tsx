import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import { Modal, Button, LoadingPanel } from 'arachne-components';
import {
  Vocabulary,
} from '../Results/selectors';

require('./style.scss');

interface IModalProps {
	modal: string;
	request: Function;
	vocab: Vocabulary;
	isLoading: boolean;
};

function ModalConfirmDownload(props: IModalProps) {
  const {
    modal,
    request,
    vocab,
    isLoading,
  } = props;
  const classes = BEMHelper('request-license');

  return (
    <Modal modal={modal} title='Request access'>
    	<div {...classes()}>
		    Vocabulary '{vocab.name}' requires a license <br />
		    <Button
			    {...classes('request-button')}
			    onClick={request}
			    mods={['submit', 'rounded']}
		    >
		    	Request
		    </Button>
	    </div>
	    <LoadingPanel active={isLoading} />
    </Modal>);
}

export default ModalConfirmDownload;
