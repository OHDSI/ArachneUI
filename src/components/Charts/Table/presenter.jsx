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
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: June 13, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Table as ArachneTable,
  Pagination,
  Select,
} from 'arachne-ui-components';
import { numberFormatter } from 'services/Utils';

require('./style.scss');

function Cell({ value }) {
  return <span>{value.formatter ? value.formatter(value.value) : value.value}</span>;
}

function Table(props) {
  const {
    columns,
    currentPage,
    data,
    onRowClick = () => {},
    pages,
    pageSize,
    path,
    selectedColumns,
    setColumns,
    setSearch,
    setSorting,
    sorting,
    totalItems,
  } = props;
  const classes = new BEMHelper('chart-table');
  const start = (currentPage - 1) * pageSize + 1;
  let end = (currentPage - 1) * pageSize + pageSize;
  if (end > totalItems) {
    end = totalItems;
  }

  return (
    <div {...classes()}>
      <div {...classes('header')}>
        <input
          {...classes('search-input')}
          onChange={(evt) => setSearch(evt.target.value)}
          placeholder='Search'
        />
        <Select
          {...classes('columns-list')}
          options={Object.keys(columns).map((col) => ({
            value: col,
            label: columns[col],
          }))}
          isMulti={true}
          onChange={setColumns}
          value={selectedColumns}
          mods={['bordered']}
        />
      </div>
      <div {...classes('content')}>
        <ArachneTable
            mods={['hover', 'selectable', 'padded']}
            data={data}
            sorting={sorting}
            setSorting={setSorting}
            onRowClick={onRowClick}
          >
            {selectedColumns && selectedColumns.map((col) =>
              <Cell
                key={col}
                header={columns[col]}
                field={col}
                mods={['bold']}
              />
            )}
        </ArachneTable>
      </div>
      <div {...classes('footer')}>
        <span {...classes('list-position-label')}>
          Showing {numberFormatter.format(start)} to {numberFormatter.format(end)} of {
            numberFormatter.format(totalItems)
          } entries
        </span>
        <div {...classes('pagination')}>
          <Pagination pages={pages} currentPage={currentPage} path={path} />
        </div>
      </div>
    </div>
  );
}

export default Table;
