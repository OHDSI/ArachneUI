/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: January 30, 2017
 *
 */

import React from 'react';
import { Modal } from 'arachne-ui-components';
import { Link } from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import { paths } from 'modules/ExpertFinder/const';

require('./style.scss');

function ModalConfirmParticipant(props) {
  const classes = new BEMHelper('study-confirm-participant');
  
  return (
  	<Modal modal={props.modal} title="Add participant">
  		<div {...classes()}>
  			Your invite has been sent to<br/>
  			<Link to={paths.profile(props.participantId)}>{props.participantName}</Link> for<br/>
  			<span {...classes('study-name')}>{props.studyName}</span>
  		</div>
  	</Modal>
  );
}

export default ModalConfirmParticipant;