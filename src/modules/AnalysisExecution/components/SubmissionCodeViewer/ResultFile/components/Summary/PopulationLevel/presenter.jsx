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
 * Created: December 20, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Table,
  TableCellText,
} from 'arachne-ui-components';

import './style.scss';

export default function SummaryPopulationLevel({ analysis, resultInfo = {}, className }) {
  const classes = BEMHelper('summary-pl');
  const results = Object.entries(resultInfo)
    .map(([key, value]) => ({ key, value }));

  return (
    <div {...classes({ extra: className })}>
      <div {...classes('result-info')}>
        <Table
          data={[resultInfo]}
        >
          {results.map(col =>
            <TableCellText
              field={col.key}
              header={col.key}
            />
          )}
        </Table>
      </div>
    </div>
  );
}
