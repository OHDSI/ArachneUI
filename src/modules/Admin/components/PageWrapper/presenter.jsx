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
 * Created: April 12, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { PageContent } from 'arachne-ui-components';
import Toolbar from './Toolbar';

require('./style.scss');

function AdminWrapper(props) {
	const { children } = props;
	const classes = new BEMHelper('admin-panel-page');
	return (
		<PageContent title='Admin settings | Arachne'>
			<div {...classes()}>
				<Toolbar/>
				{children}
			</div>
		</PageContent>
	);
}

export default AdminWrapper;
