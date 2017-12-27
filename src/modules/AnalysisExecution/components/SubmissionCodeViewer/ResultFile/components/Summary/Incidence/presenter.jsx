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

import './style.scss';

export default function SummaryIncidence({ analysis, resultInfo = {}, className }) {
  const classes = BEMHelper('summary-incidence');
  const cases = get(resultInfo, 'CASES', 0);
  const personCount = get(resultInfo, 'PERSON_COUNT', 0);
  const proportion = get(resultInfo, 'PROPORTION', 0);
  const rate = get(resultInfo, 'RATE', 0);
  const timeAtRisk = get(resultInfo, 'TIME_AT_RISK', 0);

  return (
    <div {...classes({ extra: className })}>
      <div {...classes('result-info')}>
        <span{...classes('result-element')}>
          <span {...classes('result-ico')}>open_with</span>
          <span {...classes('count')}>{numberFormatter.format(cases, 'whole')}</span>
          <span>{pluralize('Case', cases)}</span>
        </span>
        <span {...classes('result-element')}>
          <span {...classes('result-ico')}>trending_up</span>
          <span {...classes('count')}>{numberFormatter.format(rate, 'whole')}</span>
          <span>{pluralize('Rate', rate)}</span>
        </span>
        <span {...classes('result-element')}>
          <span {...classes('result-ico')}>perm_identity</span>
          <span {...classes('count')}>{numberFormatter.format(personCount, 'whole')}</span>
          <span>{pluralize('Person', personCount)}</span>
        </span>
        <span {...classes('result-element')}>
          <span {...classes('result-ico')}>pie_chart</span>
          <span {...classes('count')}>{numberFormatter.format(proportion, 'whole')}</span>
          <span>Proportion</span>
        </span>
        <span {...classes('result-element')}>
          <span {...classes('result-ico')}>timelapse</span>
          <span {...classes('count')}>{numberFormatter.format(timeAtRisk, 'whole')}</span>
          <span>Time at risk</span>
        </span>
      </div>
    </div>
  );
}
