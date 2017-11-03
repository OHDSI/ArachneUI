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
 * Created: April 24, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
	Link,
	Table,
	TableCellText as Cell,
	Checkbox
} from 'arachne-ui-components';

require('./style.scss');

function CellRemove({ id, removeUser }) {
	return (
		<Link onClick={() => removeUser(id)}>
			Remove
		</Link>
	);
}

function CellCheck({ login, value, toggle }) {
  return (
		<Checkbox isChecked={value} onChange={(e) => toggle(login, e.target.checked)} />
  );
}

function AdminTable(props) {
	const tableClasses = new BEMHelper('admin-panel-user-list-table');
  const {
    userList,
    removeUser,
		enableUser,
    sorting,
    setSearch,
  } = props;

	return (
		<Table
        {...tableClasses()}
        mods={['hover', 'padded']}
        data={userList}
        sorting={sorting}
        setSorting={setSearch}
      >
        <Cell
          {...tableClasses('name')}
          header="Name"
          field="name"
        />
        <Cell
          {...tableClasses('email')}
          header="Email"
          field="email"
        />
				<CellCheck
					{...tableClasses('enabled')}
					header="Enabled"
					field="enabled"
					isSortable={false}
					props={
						entity => ({
							login: entity.email,
							toggle: enableUser,
						})
					}
				/>
        <CellRemove
          {...tableClasses('remove')}
        	header="Remove"
        	field="id"
        	props={
						entity => ({
							id: entity.id,
							removeUser,
						})
					}
        />
      </Table>
	);
}

export default AdminTable;
