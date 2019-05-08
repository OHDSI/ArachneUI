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
  * Created: Tuesday, March 20, 2018 5:15 PM
  *
  */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import ReactDataGrid from 'react-data-grid';

import './style.scss';

function VirtualTable(props) {
  const classes = new BEMHelper('virtual-table');
  const {
    containerHeight,
    setContainer,
    data = [],
    columns = [],
  } = props;

  return (
      <div
        {...classes()}
        ref={setContainer}
      >
        <ReactDataGrid
          columns={columns}
          rowGetter={key => data[key]}
          rowsCount={data.length}
          minHeight={containerHeight}
          enableCellSelect={false}
          enableRowSelect={false}
          enableCellAutoFocus={false}
          minColumnWidth={200}
        />
      </div>
  );
}

export default VirtualTable;
