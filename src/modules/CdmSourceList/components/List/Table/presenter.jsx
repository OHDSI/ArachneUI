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
 * Created: December 28, 2016
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Table,
  TableCellText as Cell,
  Button,
} from 'arachne-ui-components';
import { healthStatuses, modelTypesValues } from 'const/dataSource';
import { paths as centralPaths } from 'modules/DataCatalog/const';
import { Utils } from 'services/Utils';
import { nodeFunctionalModes } from 'modules/Auth/const';

require('./style.scss');

function CellRegister({ published, onClick, centralId, centralDomain, username, isStandalone }) {
  const classes = new BEMHelper('data-source-list-cell-register');

  return <div {...classes()}>
    {!isStandalone && <Button
      {...classes('btn', { publish: !published })}
      mods={['submit', 'rounded']}
      label={published ? 'Edit catalog' : 'Publish'}
      link={`${centralDomain}${centralPaths.edit(centralId)}?user-req=${username}`}
      disabled={isStandalone}
      target={'_blank'}
    />}
    {(published || isStandalone) &&
      <Button
        {...classes('btn')}
        mods={['success', 'rounded']}
        label="Achilles"
        onClick={onClick}
      />
    }
  </div>;
}

function CellEdit({ editDataSource, removeDataSource, value, published, name, centralId, isStandalone }) {
  const classes = new BEMHelper('data-source-list-cell-edit');
  const tooltipClass = new BEMHelper('tooltip');
  const button = (<Button {...classes('btn')} onClick={() => {
          Utils.confirmDelete({
            message: `Delete data source '${name}'?`,
          })
            .then(() => removeDataSource({ id: value, published }))
            .catch(() => {});
        }} disabled={ isStandalone && centralId }>
          <i {...classes('btn-ico')}>delete</i>
        </Button>
  );
  const buttonWithTooltip = (isStandalone && centralId) ? (<span {...tooltipClass({extra: 'source-list-cell-tooltip'})}
          aria-label={"Deletion of published Data Source is prohibited in the Standalone mode"} 
          data-tootik-conf="left multiline">
          {button}
      </span>
  ) : button;
  return (
    <div {...classes('btn-block')}>
      <Button {...classes('btn')} onClick={() => editDataSource(value)}>
        <i {...classes('btn-ico')}>edit</i>
      </Button>
      {buttonWithTooltip}
    </div>);
}

function CellName({ value, healthStatus, index }) {
  const classes = new BEMHelper('ds-name');
  return <div key={index + 'indicator-span'} {...classes()}>
    <div {...classes({
      element: 'indicator',
      modifiers: [healthStatus.title],
      extra: 'ac-tooltip',
    })}
      aria-label={healthStatuses.getTitle(healthStatus.title)}
      data-tootik-conf="right"
    ></div>
    <span  {...classes('name')}>{value}</span>
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
    centralDomain,
    username,
    runningMode,
  } = props;

  const isStandalone = runningMode === nodeFunctionalModes.Standalone;
  const className = (title) => title + (isStandalone ? '_standalone' : '');
  const cells = [
      <CellName
        {...tableClasses(className('name'))}
        header="Name"
        field="name"
        mods={['bold']}
        props={item => item}
      />,
      <Cell
        {...tableClasses('dbms-type')}
        header="DBMS Type"
        field="dbmsType"
      />,
      <Cell
        {...tableClasses(className('db-name'))}
        header="Database"
        field="connectionString"
      />,
      <Cell
        {...tableClasses('cdm-schema')}
        header="CDM Schema"
        field="cdmSchema"
      />,
      !isStandalone && <Cell
        {...tableClasses('model-type')}
        header="Model"
        field="modelType"
        isSortable={false}
      />,
      <CellRegister
        {...tableClasses(className('register'))}
        props={
          entity => ({
            published: entity.published,
            onClick: () => goToDataSource(entity.id),
            centralId: entity.centralId,
            centralDomain,
            username,
            isStandalone,
          })
        }
      />,
      <CellEdit
        {...tableClasses('edit')}
        field="id"
        editDataSource={editDataSource}
        removeDataSource={remove}
        props={entity => ({ published: entity.published, name: entity.name, centralId: entity.centralId, isStandalone })}
      />
    ].filter(c => c);

  return (<Table
      {...tableClasses()}
      mods={['hover', 'padded']}
      data={dataSourceList}
      sorting={sorting}
      setSorting={setSearch}
    >
    {cells}
    </Table>
  );
}

export default DataSourceTable;
