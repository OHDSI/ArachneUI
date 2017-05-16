import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import { Modal, ListItem, Button } from 'arachne-components';
import { DownloadParams } from 'modules/Vocabulary/actions/download';
import { Field } from 'redux-form';

require('./style.scss');

interface IVocab {
	name: string;
	id: number;
};

interface IModalStateProps {
	selectedVocabs: Array<IVocab>;
	selectedVocabIds: Array<number>;
	cdmVersion: string;
	bundleName: string;
};

interface IModalDispatchProps {
	remove: (id: number) => any;
	close: () => null;
	download: () => null;
  requestDownload: (params: DownloadParams) => any;
  showHistory: () => null;
};

interface IModalProps extends IModalStateProps, IModalDispatchProps {
	modal: string;
	removeVocabulary: (id: number) => any;
	handleSubmit: (handler: Function) => any;
	error: string;
};

function BundleName({ options, input }) {
	return <input
		className={options.className}
		value={input.value}
		onChange={input.onChange}
		placeholder='name bundle'
	/>;
}

function ModalConfirmDownload(props: IModalProps) {
  const {
    close,
    download,
    modal,
    removeVocabulary,
    selectedVocabs,
    handleSubmit,
    error,
  } = props;
  const classes = BEMHelper('confirm-download');

  return (
    <Modal modal={modal} title='Download summary' mods={['no-padding']}>
	    <form onSubmit={handleSubmit(download)}>
	    	<div {...classes()}>
	    		<div {...classes('bundle-name')}>
	    			<Field component={BundleName} name='bundleName' options={{
	    				className: classes('bundle-name-input').className
	    			}} />
	    		</div>
		      {selectedVocabs && selectedVocabs.map((voc: IVocab, index: number) =>
		      	<ListItem key={index}>
		      		{voc.name}
		      		<Button {...classes('remove-button')} onClick={() => removeVocabulary(voc.id)}>
		      			Remove
		      		</Button>
		      	</ListItem>
		      	)
		      }
		      {error &&
		      	<div {...classes('errors')}>
			      	<span {...classes('error')}>{error}</span>
			      </div>
			    }
		      <div {...classes('actions')}>
			      <Button mods={['submit']} type='submit' {...classes('download-button')}>Download</Button>
			      <Button mods={['cancel']} onClick={close}>Cancel</Button>
		      </div>
	      </div>
	    </form>
    </Modal>);
}

export default ModalConfirmDownload;
export {
	IModalProps,
	IModalStateProps,
	IModalDispatchProps,
	IVocab,
};
