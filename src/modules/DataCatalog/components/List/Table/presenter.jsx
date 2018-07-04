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
 * Created: January 26, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Table,
  TableCellText as Cell,
} from 'arachne-ui-components';
import LabelDataSource from 'components/LabelDataSource';

function CellName({ dataSource, className }) {
  return (
    <div className={className}>
      <LabelDataSource {...dataSource} />
    </div>
  );
}

function DataSourcesTable(props) {
  const {
    dataSourceList,
    columns,
    isLoading,
    setSorting,
    sorting,
  } = props;
  const tableClasses = new BEMHelper('data-catalog-table');

  return (
    <Table
      {...tableClasses()}
      data={dataSourceList}
      mods={['hover', 'padded', 'selectable']}
      onRowClick={props.showDatasource}
      setSorting={setSorting}
      sorting={sorting}
    >
      {columns && columns.map((col, key) => {
          if (col.name === 'name') {
            return <CellName
              {...tableClasses('ds-name', '', tableClasses('meta').className)}
              header={col.label}
              field={'dataNode,name'}
              props={dataSource => ({ dataSource })}
            />
          }
          return <Cell
            {...tableClasses('meta')}
            key={key}
            header={col.label}
            field={col.name}
          />
        }
      )}
    </Table>
  )
}

export default DataSourcesTable;
