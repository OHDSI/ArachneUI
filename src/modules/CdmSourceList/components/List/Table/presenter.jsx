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
 * Created: December 28, 2016
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { Table } from 'arachne-ui-components';
import { TableCellText as Cell } from 'arachne-ui-components';
import { Link } from 'arachne-ui-components';
import { Button } from 'arachne-ui-components';
import { healthStatuses } from 'const/dataSource';

require('./style.scss');

function CellRegistered({ value }) {
  const classes = new BEMHelper('data-source-list-cell-registered');
  const isRegistered = value;
  const modifiers = isRegistered ? 'green' : 'grey';

  return (
    <span {...classes({ modifiers })}>
      {isRegistered ? 'Registered' : 'Not registered'}
    </span>
  );
}

function CellRegister({ isRegistered, onClick }) {
  const classes = new BEMHelper('data-source-list-cell-register');

  return (
    <div {...classes()}>
      {isRegistered ?
        <Button
          {...classes('btn')}
          mods={['success', 'rounded']}
          label="Edit metadata"
          onClick={onClick}
        />
        :
        <Button
          {...classes('btn')}
          mods={['submit', 'rounded']}
          label="Register"
          onClick={onClick}
        />
      }
    </div>
  );
}

function CellEdit({ editDataSource, removeDataSource, value, isRegistered }) {
  const classes = new BEMHelper('data-source-list-cell-edit');
  return (
    <div {...classes('btn-block')}>
      <Button {...classes('btn')} onClick={() => editDataSource(value)}>
        <i {...classes('btn-ico')}>edit</i>
      </Button>
      <Button {...classes('btn')} onClick={() => removeDataSource(value)} disabled={isRegistered}>
        <i {...classes('btn-ico')}>delete</i>
      </Button>
    </div>

  );
}

function CellName({ value, healthStatus }) {
  const classes = new BEMHelper('ds-name');
  return <div {...classes()}>
    <div {...classes({
      element: 'indicator',
      modifiers: [healthStatus.title],
      extra: 'ac-tooltip',
    })}
         aria-label={healthStatuses.getTitle(healthStatus.title)}
         data-tootik-conf="right"
    ></div>
    {value}
  </div>;
}

function DataSourceTable(props) {
  const tableClasses = new BEMHelper('data-source-list-table');
  const {
    dataSourceList,
    editDataSource,
    remove,
    goToDataSource,
    setSearch,
    sorting,
  } = props;

  return (
    <Table
      {...tableClasses()}
      mods={['hover', 'padded']}
      data={dataSourceList}
      sorting={sorting}
      setSorting={setSearch}
    >
      <CellName
        {...tableClasses('name')}
        header="Name"
        field="name"
        mods={['bold']}
        props={item => item}
      />
      <Cell
        {...tableClasses('dbms-type')}
        header="DBMS Type"
        field="dbmsType"
      />
      <Cell
        {...tableClasses('db-name')}
        header="Database"
        field="connectionString"
      />
      <Cell
        {...tableClasses('cdm-schema')}
        header="CDM Schema"
        field="cdmSchema"
      />
      <Cell
        {...tableClasses('model-type')}
        header="Model"
        field="modelType"
      />
      <CellRegistered
        {...tableClasses('registered')}
        header="Registered"
        field="isRegistered"
      />
      <CellRegister
        {...tableClasses('register')}
        props={
          entity => ({
            isRegistered: entity.isRegistered,
            onClick: () => goToDataSource(entity.id),
          })
        }
      />
      <CellEdit
        {...tableClasses('edit')}
        field="id"
        editDataSource={editDataSource}
        removeDataSource={remove}
        props={entity => ({ isRegistered: entity.isRegistered })}
      />
    </Table>
  );
}

export default DataSourceTable;
