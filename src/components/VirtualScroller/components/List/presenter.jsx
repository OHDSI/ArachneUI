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
  * Created: Wednesday, March 28, 2018 3:19 PM
  *
  */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import Table from '../Table';

import './style.scss';

function VirtualList(props) {
  const classes = new BEMHelper('virtual-list');
  const {
    className,
    rowClassesResolver,
    rowRenderer = ({ value }) => <span>{JSON.stringify(value)}</span>,
    data = [],
  } = props;

  const parsedData = data.map(row => ({
    row,
  }));

  return (
      <div
        {...classes({ extra: className })}
      >
        <Table
          columns={[{ key: 'row', name: '', formatter: rowRenderer }]}
          data={parsedData}
          list
        />
      </div>
  );
}

export default VirtualList;
