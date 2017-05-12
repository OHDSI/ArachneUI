import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import { Modal, ListItem, Button } from 'arachne-components';
import { DownloadParams } from 'modules/Vocabulary/actions/download';

require('./style.scss');

interface IVocab {
	name: string;
	id: number;
};

interface IModalStateProps {
	selectedVocabs: Array<IVocab>;
	selectedVocabIds: Array<number>;
	cdmVersion: string;
};

interface IModalDispatchProps {
	remove: (id: number) => any;
	close: () => null;
	download: () => null;
  requestDownload: (params: DownloadParams) => any;
	showResult: () => null;
};

interface IModalProps extends IModalStateProps, IModalDispatchProps {
	modal: string;
	removeVocabulary: (id: number) => any;
};

function ModalConfirmDownload(props: IModalProps) {
  const {
    close,
    download,
    modal,
    removeVocabulary,
    selectedVocabs,
  } = props;
  const classes = BEMHelper('confirm-download');

  return (
    <Modal modal={modal} title='Download summary' mods={['no-padding']}>
    	<div {...classes()}>
	      {selectedVocabs && selectedVocabs.map((voc: IVocab, index: number) =>
	      	<ListItem key={index}>
	      		{voc.name}
	      		<Button {...classes('remove-button')} onClick={() => removeVocabulary(voc.id)}>
	      			Remove
	      		</Button>
	      	</ListItem>
	      	)
	      }
	      <div {...classes('actions')}>
		      <Button mods={['submit']} onClick={download} {...classes('download-button')}>Download</Button>
		      <Button mods={['cancel']} onClick={close}>Cancel</Button>
	      </div>
      </div>
    </Modal>);
}

export default ModalConfirmDownload;
export {
	IModalProps,
	IModalStateProps,
	IModalDispatchProps,
	IVocab,
};
