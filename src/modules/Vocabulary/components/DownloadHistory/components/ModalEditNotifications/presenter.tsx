import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import { Modal, ListItem, Button, LoadingPanel } from 'arachne-components';

require('./style.scss');

interface IVocab {
	name: string;
	id: number;
};

interface IModalStateProps {
	selectedVocabs: Array<IVocab>;
	isOpened: boolean;
	isLoading: boolean;
};

interface IModalDispatchProps {
	notify: ({ notify: boolean, vocabularyV4Id: number }) => any;
	close: Function;
	getNotifications: Function;
};

interface IModalProps extends IModalStateProps, IModalDispatchProps {
	modal: string;
	removeVocabulary: (id: number) => any;
};

function ModalEditNotifications(props: IModalProps) {
  const {
    close,
    modal,
    removeVocabulary,
    selectedVocabs,
    isLoading,
  } = props;
  const classes = BEMHelper('modal-notifications');

  return (
  	<div {...classes()}>
	    <Modal modal={modal} title='Tracked vocabularies' mods={['no-padding']}>
	      {selectedVocabs && selectedVocabs.map((voc: IVocab, index: number) =>
	      	<ListItem key={index}>
	      		{voc.name}
	      		<Button {...classes('remove-button')} onClick={() => removeVocabulary(voc.id)}>
	      			Stop tracking
	      		</Button>
	      	</ListItem>
	      	)
	      }
	      {(!selectedVocabs || !selectedVocabs.length) &&
	      	<ListItem {...classes('empty-state')}>No vocabularies found</ListItem>
	      }
	      <div {...classes('actions')}>
		      <Button mods={['cancel']} onClick={close}>Close</Button>
	      </div>
	    </Modal>
      <LoadingPanel active={isLoading} />
    </div>);
}

export default ModalEditNotifications;
export {
	IModalProps,
	IModalStateProps,
	IModalDispatchProps,
	IVocab,
};
