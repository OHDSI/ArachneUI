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
 * Authors: Pavel Grafkin
 * Created: April 26, 2019
 *
 */


import React from 'react';
import BEMHelper from 'services/BemHelper';
import {ListItem, LoadingPanel} from 'arachne-ui-components';
import People from 'components/People';

require('./style.scss');

export default function UsersList({isLoading, isManualSource, userList, openModal, removeDataOwner}) {
	const classes = new BEMHelper('data-source-users');

	return (
		<div {...classes()}>
			<People
				title="Data owners"
				userList={userList}
				remove={(userList.length > 1 && isManualSource) ? removeDataOwner : null}
			>
				{isManualSource ? <ListItem label="Add owner" mods="add" onClick={openModal}/> : null}
			</People>
        	<LoadingPanel active={isLoading} />
		</div>
	)
}