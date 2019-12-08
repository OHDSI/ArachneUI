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
 * Created: April 12, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import PageWrapper from 'modules/Admin/components/PageWrapper';
import Table from './Table';
import ModalAddUser from './ModalAddUser';
import {
	LoadingPanel,
} from 'arachne-ui-components';
import ProtectedView from 'modules/Admin/components/ProtectedView';

require('./style.scss');

function AdminList({ isLoading, openModal, isStandalone}) {
	const classes = new BEMHelper('admin-panel-admin-list');

	return (
		<ProtectedView>
			<PageWrapper>
					<Table/>
					{ !isStandalone && (<div {...classes('add')} onClick={openModal}>
						<span {...classes('add-icon')}>add_circle_outline</span>
						<span {...classes('add-label')}>Add admin user</span>
					</div>) }
					<ModalAddUser />
					<LoadingPanel active={ isLoading } />
			</PageWrapper>
		</ProtectedView>
	);
}

export default AdminList;
