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
import pluralize from 'pluralize';
import { get, numberFormatter } from 'services/Utils';
import {
  Table,
  TableCellText,
} from 'arachne-ui-components';

import './style.scss';

export default function SummaryIncidence({ resultInfo = {}, className }) {
  const classes = BEMHelper('summary-incidence');
  const cases = get(resultInfo, 'CASES', 0);
  const personCount = get(resultInfo, 'PERSON_COUNT', 0);
  const proportion = get(resultInfo, 'PROPORTION', 0);
  const rate = get(resultInfo, 'RATE', 0);
  const timeAtRisk = get(resultInfo, 'TIME_AT_RISK', 0);

  return (
    <div {...classes({ extra: className })}>
      <Table
        data={[{ cases, rate, personCount, proportion, timeAtRisk }]}
      >
        <TableCellText header={'Persons'} field={'personCount'} />
        <TableCellText header={'Cases'} field={'cases'} />
        <TableCellText
          header={<div {...classes('header')}>
            <span>Proportion [+|-]</span>
            <span {...classes('header-subtitle')}>per 1k persons</span>
          </div>}
          field={'proportion'}
        />
        <TableCellText
          header={<div {...classes('header')}>
            <span>Time At Risk</span>
            <span {...classes('header-subtitle')}>(years)</span>
          </div>}
          field={'timeAtRisk'}
        />
        <TableCellText
          header={<div {...classes('header')}>
            <span>Rate [+|-]</span>
            <span {...classes('header-subtitle')}>per 1k years</span>
          </div>}
          field={'rate'}
        />
      </Table>
    </div>
  );
}
