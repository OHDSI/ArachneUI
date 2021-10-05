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
 * Created: December 20, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { get } from 'services/Utils';
import {
  Table,
  TableCellText,
} from 'arachne-ui-components';

import './style.scss';

function calculateValue(value, ratio) {
  if (value.count > 0)
    return (((1.0 * value.cases) / (1.0 * value.count)) * ratio).toFixed(2);
  else
    return (0).toFixed(2);
}

function DynamicCell({value, ratio}) {
  return <div>{calculateValue(value, ratio)}</div>;
}

export default function SummaryIncidence({ resultInfo = [], className, exponent, changeExponent }) {
  const classes = BEMHelper('summary-incidence');

  let data;
  if (Array.isArray(resultInfo)) {
      data = resultInfo.map(r => ({
          targetCohort: get(r, 'TARGET_NAME'),
          outcomeCohort: get(r, 'OUTCOME_NAME'),
          cases: get(r, 'CASES', 0),
          personCount: get(r, 'PERSON_COUNT', 0),
          proportion: {
            cases: get(r, 'CASES', 0),
            count: get(r, 'PERSON_COUNT', 0),
          },
          rate: {
            cases: get(r, 'CASES', 0),
            count: get(r, 'TIME_AT_RISK', 0),
          },
          timeAtRisk: get(r, 'TIME_AT_RISK', 0),
      }));
  } else {
      data = [];
      console.error("Received improper format of result info for IR");
  }

  const ratio = Math.pow(10, exponent);
  const ratioHeader = ratio >= 1000 ? (ratio / 1000) + 'k' : ratio;

  return (
    <div {...classes({ extra: className })}>
      <Table
        data={data}
      >
        <TableCellText header={'Target Cohort'} field={'targetCohort'} />
        <TableCellText header={'Outcome Cohort'} field={'outcomeCohort'} />
        <TableCellText header={'Persons'} field={'personCount'} />
        <TableCellText header={'Cases'} field={'cases'} />
        <DynamicCell
          header={<div {...classes('header')}>
            <span>Proportion [
              <span {...classes('span-active')} onClick={() => changeExponent(1)}> + </span>
              |
              <span {...classes('span-active')} onClick={() => changeExponent(-1)}> - </span>]
            </span>
            <span {...classes('header-subtitle')}>per {ratioHeader} persons</span>
          </div>}
          field={'proportion'}
          ratio={ratio}
        />
        <TableCellText
          header={<div {...classes('header')}>
            <span>Time At Risk</span>
            <span {...classes('header-subtitle')}>(years)</span>
          </div>}
          field={'timeAtRisk'}
        />
        <DynamicCell
          header={<div {...classes('header')}>
            <span>Rate [
              <span {...classes('span-active')} onClick={() => changeExponent(1)}> + </span>
              |
              <span {...classes('span-active')} onClick={() => changeExponent(-1)}> - </span>]
            </span>
            <span {...classes('header-subtitle')}>per {ratioHeader} years</span>
          </div>}
          field={'rate'}
          ratio={ratio}
        />
      </Table>
    </div>
  );
}
