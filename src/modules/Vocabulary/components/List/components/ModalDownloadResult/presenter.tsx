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