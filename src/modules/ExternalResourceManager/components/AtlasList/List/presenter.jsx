/*
 *
 * Copyright 2018 Observational Health Data Sciences and Informatics
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
 * Authors: Pavel Grafkin
 * Created: March 15, 2018
 *
 */

import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Button,
  Table,
  TableCellText as Cell,
} from 'arachne-ui-components';
import CellRemove from 'components/CellRemove';

import './style.scss';

function CellEdit({ id, edit, remove }) {
  const classes = new BEMHelper('atlas-table-cell-edit');
  return (
    <div {...classes('btn-block')}>
      <Button {...classes('btn')} onClick={() => edit(id)}>
        <i {...classes('btn-ico')}>edit</i>
      </Button>
      <Button {...classes('btn')} onClick={() => remove(id)}>
        <i {...classes('btn-ico')}>delete</i>
      </Button>
    </div>
  );
}

function AtlasTable(props) {
  const classes = new BEMHelper('atlases-table');
  const {
    data,
    editAtlas,
    deleteAtlas,
    sorting,
    setSorting,
  } = props;

  return (
    <Table
      {...classes()}
      mods={['hover', 'padded']}
      data={data}
      sorting={sorting}
      setSorting={setSorting}
    >
      <Cell
        {...classes('name')}
        header="Name"
        field="name"
      />
      <Cell
        {...classes('version')}
        header="Version"
        field="version"
      />
      <Cell
        {...classes('url')}
        header="Url"
        field="url"
      />
      <CellEdit
        {...classes('edit')}
        isSortable={false}
        props={
          entity => ({
            id: entity.id,
            edit: editAtlas,
            remove: deleteAtlas,
          })
        }
      />
    </Table>
  );
}

export default AtlasTable;
