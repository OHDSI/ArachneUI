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
  * Created: Wednesday, March 28, 2018 3:19 PM
  *
  */

import React from 'react';
import { AutoSizer, CellMeasurer, List, CellMeasurerCache } from 'react-virtualized';
import BEMHelper from 'services/BemHelper';

import './style.scss';

const cache = new CellMeasurerCache({
  defaultHeight: 46,
  fixedWidth: true,
});

function VirtualListRow({
  index,
  isScrolling,
  isVisible,
  key,
  parent,
  style,

  entity,
  renderer,
  rowClassesResolver = () => ({}),
}) {
  return (
    <CellMeasurer
      cache={cache}
      columnIndex={0}
      key={key}
      parent={parent}
      rowIndex={index}
    >
      {({ measure }) => (
        <div
          key={key}
          style={style}
          {...rowClassesResolver(entity)}
        >
          {renderer(entity)}
        </div>
      )}
    </CellMeasurer>
  );
}

export default function VirtualList({
  className,
  rowClassesResolver,
  rowRenderer,
  data = [],
}) {
  return (
    <div className={className}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            rowRenderer={(props) => {
              const entity = data[props.index];
              return (
                <VirtualListRow
                  {...props}
                  renderer={rowRenderer}
                  entity={entity}
                  rowClassesResolver={rowClassesResolver}
                />
              );
            }}
            deferredMeasurementCache={cache}
            width={width}
            height={height}
            rowCount={data.length}
            rowHeight={cache.rowHeight}
          />
        )}
      </AutoSizer>
    </div>
  );
} 