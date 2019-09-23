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
 * Created: December 15, 2017
 *
 */

import React, { Component } from 'react';
import BEMHelper from 'services/BemHelper';
import { get } from 'services/Utils';
import { numberFormatter } from 'services/Utils';
import pluralize from 'pluralize';
import min from 'lodash/min';
import max from 'lodash/max';

require('./style.scss');

export default class Results extends Component {

  tooltipClass = new BEMHelper('tooltip');

  BaseSpan = ({ string }) => {
    return this.props.hasAccess ?
      <span>{string}</span>
      :
      <span {...this.tooltipClass()} data-tootik-conf="top" aria-label="Only contributors can view the results">{string}</span>;
  };

  Cohort = () => {
    const persons = get(this.props.resultInfo, 'persons');
    return <this.BaseSpan string={pluralize('person', persons, true)}/>;
  };

  Default = () => {
    return <this.BaseSpan string={pluralize('document', this.props.resultFilesCount, true)}/>;
  };

  CohortHeracles = () => {
    const { resultInfo } = this.props;
    const persons = get(resultInfo, 'persons') || 0;
    const reports = get(resultInfo, 'reports') || 0;
    return <this.BaseSpan string={`${pluralize('person', persons, true)}, ${pluralize('report', reports, true)}`}/>;
  };

  CohortCharacterization = () => {
    const reports = get(this.props.resultInfo, 'reports') || 0;
    return <this.BaseSpan string={pluralize('report', reports, true)}/>;
  };

  Incidence = () => {
    const { resultInfo } = this.props;

    let tooltipString;
    let label;

    if (Array.isArray(resultInfo) && resultInfo.length > 1) {
      const rates = resultInfo.map(o => o.RATE);
      const cases = resultInfo.map(o => o.CASES);
      const persons = resultInfo.map(o => o.PERSON_COUNT);
      const timesAtRisk = resultInfo.map(o => o.TIME_AT_RISK);
      const proportions = resultInfo.map(o => o.PROPORTION);
      tooltipString = `Rate: ${min(rates)} - ${max(rates)}
        Cases: ${min(cases)} - ${max(cases)}
        Persons: ${min(persons)} - ${max(persons)}
        Time at risk: ${min(timesAtRisk)} - ${max(timesAtRisk)}
        Proportion: ${min(proportions)} - ${max(proportions)}`;
      label = `${resultInfo.length} ${pluralize('combination', resultInfo.length)}`;
    } else if (Array.isArray(resultInfo) && resultInfo.length === 1) {
      const entry = resultInfo[0];
      const personCount = get(entry, 'PERSON_COUNT') || 0;
      const timeAtRisk = get(entry, 'TIME_AT_RISK') || 0;
      const cases = get(entry, 'CASES') || 0;
      const rate = get(entry, 'RATE') || 0;
      const proportion = get(entry, 'PROPORTION') || 0;
      tooltipString = `Rate: ${rate}
  ${pluralize('Case', cases)}: ${cases}
  ${pluralize('Person', personCount)}: ${personCount}
  Time at risk: ${timeAtRisk}
  Proportion: ${proportion}`;
      label = `${numberFormatter.format(cases, 'short')} ${pluralize('case', cases)}, ${numberFormatter.format(personCount, 'short')} ${pluralize('person', personCount)}`;
    }


    return (<div
      {...this.tooltipClass({ modifiers: 'preformatted' })}
      aria-label={tooltipString}
      data-tootik-conf='left'
    >
      {label}
    </div>);
  };

  render() {
    let element;
    switch (this.props.analysisType) {
      case 'COHORT':
        element = <this.Cohort/>;
        break;
      case 'COHORT_HERACLES':
        element = <this.CohortHeracles />;
        break;
      case 'COHORT_CHARACTERIZATION':
        element = <this.CohortCharacterization/>;
        break;
      case 'INCIDENCE':
        element = <this.Incidence/>;
        break;
      default:
        element = <this.Default/>;
    }
    return element;
  }
}
