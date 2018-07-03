/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
import { paths } from 'modules/StudyManager/const';

require('./style.scss');

function ModalConfirmDatasource(props) {
  const classes = new BEMHelper('study-confirm-datasource');
  const end = props.datasources.length > 1 ? 's' : '';
  
  return (
  	<Modal modal={props.modal} title="Add datasource">
  		<div {...classes()}>
  			{`Your invite${end} has been sent to`}<br/>
        {props.datasources.map((datasource, i) =>
  			  <Link {...classes('ds-name')} key={i} to={paths.dataSources(datasource.value)}>{datasource.label}</Link>
        )} for<br/>
  			<span {...classes('study-name')}>{props.studyName}</span>
  		</div>
  	</Modal>
  );
}

export default ModalConfirmDatasource;