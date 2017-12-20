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
 * Created: August 11, 2017
 *
 */

import React from 'react';
import CSV from 'comma-separated-values';
import {
  Table,
} from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';

import './style.scss';

function TableCellText({ className, value }) {

  return (
    <span className={className}>
      {value}
    </span>
  );
}

function CsvTable({ columns, rows, sticky = false, reference }) {
  const classes = BEMHelper('csv-viewer');

  return (
    <Table
      {...classes({ element: 'table', modifiers: { sticky } })}
      data={rows}
      mods={['hover']}
      reference={reference}
    >
      {columns.map((col, i) =>
        <TableCellText
          key={i}
          {...classes('header')}
          header={col.header}
          field={col.field}
        />
      )}
    </Table>
  );
}

export default function CsvViewer(props) {
  const classes = BEMHelper('csv-viewer');
  const {
    data,
    widths,
    setThWidths,
  } = props;
  let isHeaderRead = false;
  const columns = [];
  const rows = [];
  if (data) {
    new CSV(data).forEach((array) => {
      if (!isHeaderRead) {
        isHeaderRead = true;
        array.forEach((cell, idx) => {
          columns.push({
            field: `key${idx}`,
            header: cell,
          });
        });
      } else {
        const row = {};
        array.forEach((cell, idx) => {
          row[`key${idx}`] = cell;
        });
        rows.push(row);
      }
    });
  }

  return (
    <div {...classes()}>
      <CsvTable columns={columns} rows={[]} sticky reference={(el) => {
        if (el && Array.isArray(widths) && widths.length) {
          el.querySelectorAll('th').forEach((th, index) => {
            th.width = widths[index];
          });
        }
      }} />
      <CsvTable columns={columns} rows={rows} reference={(el) => {
        if (el && !widths) {
          setThWidths(el.querySelectorAll('th'));
        }
      }} />
    </div>
  );
}
