/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
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
import { Modal, Button, LoadingPanel } from 'arachne-ui-components';
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
