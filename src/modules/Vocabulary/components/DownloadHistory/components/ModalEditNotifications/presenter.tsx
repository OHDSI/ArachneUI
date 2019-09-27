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
import { Modal, ListItem, Button, LoadingPanel } from 'arachne-ui-components';

require('./style.scss');

interface IVocab {
	code: string;
	name: string;
	id: number;
};

interface IModalStateProps {
	selectedVocabs: Array<IVocab>;
	isOpened: boolean;
	isLoading: boolean;
};

interface IModalDispatchProps {
	removeNotification: (vocabularyCode: string) => any;
	close: Function;
	getNotifications: Function;
};

interface IModalProps extends IModalStateProps, IModalDispatchProps {
	modal: string;
	removeVocabulary: (code: string) => any;
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
	      		<Button {...classes('remove-button')} onClick={() => removeVocabulary(voc.code)}>
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
