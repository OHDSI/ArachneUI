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
 * Created: December 27, 2016
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import get from 'lodash/get';
import { numberFormatter } from 'services/Utils';

require('./style.scss');

export default function Results(props) {

  const {
    resultInfo,
    resultFilesCount,
    analysisType,
  } = props;

  let element;
  switch (analysisType) {
    case 'COHORT':
      element = <Cohort resultInfo={resultInfo} resultFilesCount={resultFilesCount}/>;
      break;
    case 'COHORT_CHARACTERIZATION':
      element = <CohortCharacterization resultInfo={resultInfo} resultFilesCount={resultFilesCount}/>;
      break;
    case 'INCIDENCE':
      element = <Incidence resultInfo={resultInfo} resultFilesCount={resultFilesCount}/>;
      break;
    default:
      element = <Default resultFilesCount={resultFilesCount}/>;
  }
  return element;
}

function Cohort(props) {

  const {
    resultInfo,
  } = props;

  const persons = get(resultInfo, 'persons');

  return <span>{!!persons ? persons : 0} person{persons !== 1 ? 's' : ''}</span>;
}

function CohortCharacterization(props) {
  const {
    resultInfo,
  } = props;

  const reports = get(resultInfo, 'reports');

  return <span>{!!reports ? reports : 0} report{reports !== 1 ? 's' : ''}</span>;
}

function Incidence(props) {

  const {
    resultInfo,
  } = props;

  const classes = new BEMHelper('incedence-label');
  const tooltipClass = new BEMHelper('tooltip');

  const personCount = get(resultInfo, 'PERSON_COUNT');
  const timeAtRisk = get(resultInfo, 'TIME_AT_RISK');
  const cases = get(resultInfo, 'CASES');
  const rate = get(resultInfo, 'RATE');
  const proportion = get(resultInfo, 'PROPORTION');
  const tooltipString = `Rate: ${rate}
  Case${cases > 1 ? 's' : ''}: ${cases} 
  Person${personCount > 1 ? 's' : ''}: ${personCount} 
  Time at risk: ${timeAtRisk} 
  Proportion: ${proportion}`;

  return <div {...classes({
    extra: tooltipClass({ modifiers: 'preformatted' }).className,
    element: 'line',
  })} aria-label={tooltipString} data-tootik-conf='left' >
    <span{...classes({ element: 'result-element' })}>
      <span {...classes({ element: 'result-ico' })}>trending_up</span>
      <span>{numberFormatter.format(rate, 'short')}</span>
    </span>
    <span{...classes({ element: 'result-element' })}>
      <span {...classes({ element: 'result-ico' })}>open_with</span>
      <span>{numberFormatter.format(cases, 'short')}</span>
    </span>
    <span{...classes({ element: 'result-element' })}>
      <span {...classes({ element: 'result-ico' })}>perm_identity</span>
      <span>{numberFormatter.format(personCount, 'short')}</span>
    </span>
  </div>;
}

function Default(props) {
  const {
    resultFilesCount,
  } = props;
  return <span>{resultFilesCount} document{resultFilesCount !== 1 ? 's' : ''}</span>;
}
