/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexandr Saltykov, Pavel Grafkin, Vitaly Koulakov, Anton Gackovka
 * Created: March 3, 2017
 *
 */

import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import { Modal, ListItem, Button, Select, Checkbox, LoadingPanel } from 'arachne-ui-components';
import { DownloadParams } from 'modules/Vocabulary/actions/download';
import { cdmVersions } from 'modules/Vocabulary/const';
import { Field } from 'redux-form';

require('./style.scss');

interface IVocab {
	code: string;
	name: string;
	id: number;
};

interface IModalStateProps {
	selectedVocabs: Array<IVocab>;
	selectedVocabIds: Array<number>;
	isOpened: boolean;
	initialValues: {
		[key: string]: any;
	};
	isLoading: boolean;
};

interface IModalDispatchProps {
	remove: (id: number) => any;
	close: () => null;
	download: () => null;
	requestDownload: (params: DownloadParams) => any;
	showResult: () => null;
	reset: Function;
	notify: Function;
	updateNotifications: Function;
	loadList: Function;
};

interface IModalProps extends IModalStateProps, IModalDispatchProps {
	modal: string;
	removeVocabulary: (id: number) => any;
	handleSubmit: (handler: Function) => any;
	error: string;
};

interface IReduxFieldProps {
  options: any;
  input: any;
};

function BundleName(props: IReduxFieldProps) {
	const { options, input } = props;
	return <input
		className={options.className}
		value={input.value}
		onChange={input.onChange}
		placeholder='name bundle'
	/>;
}

function cdmVersionSelect(props: IReduxFieldProps) {
  const { options, input } = props;
  return (<Select
    className={options.className}
    options={cdmVersions}
    value={input.value}
    onChange={input.onChange}
   />);
}

function Notify(props: IReduxFieldProps) {
	const { options, input } = props;
	return (<Checkbox
		isChecked={input.value === true}
		onChange={input.onChange}
		label='Notify me about changes in these vocabularies'
	/>);
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
    isLoading,
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
			      <Field
			        component={cdmVersionSelect}
			        options={{...classes('cdm-version-select')}}
			        name='cdmVersion'
			      />
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
		      <ListItem {...classes('notify')}>
			      <Field
			        component={Notify}
			        options={{...classes('notify')}}
			        name='notify'
			      />
		      </ListItem>
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
	    <LoadingPanel active={isLoading} />
    </Modal>);
}

export default ModalConfirmDownload;
export {
	IModalProps,
	IModalStateProps,
	IModalDispatchProps,
	IVocab,
};
