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
import { formatNumberWithLabel } from 'services/Utils';

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
    const string = formatNumberWithLabel({ label: 'person', value: persons });
    return <this.BaseSpan string={string}/>;
  };

  Default = () => {
    const documents = this.props.resultFilesCount;
    const string = formatNumberWithLabel({ label: 'document', value: documents });
    return <this.BaseSpan string={string}/>;
  };

  CohortHeracles = () => {
    const { resultInfo } = this.props;
    const persons = get(resultInfo, 'persons') || 0;
    const reports = get(resultInfo, 'reports') || 0;
    const string = `${formatNumberWithLabel({ label: 'person', value: persons })}, ${formatNumberWithLabel({ label: 'report', value: reports })}}`
    return <this.BaseSpan string={string}/>;
  };

  CohortCharacterization = () => {
    const reports = get(this.props.resultInfo, 'reports') || 0;
    const string = formatNumberWithLabel({ label: 'report', value: reports });
    return <this.BaseSpan string={string}/>;
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
      tooltipString = `Rate: ${formatNumberWithLabel({ value: rates, range: true, withoutLabel: true })}
        Cases: ${formatNumberWithLabel({ value: cases, range: true, withoutLabel: true })}
        Persons: ${formatNumberWithLabel({ value: persons, range: true, withoutLabel: true })}
        Time at risk: ${formatNumberWithLabel({ value: timesAtRisk, range: true, withoutLabel: true })}
        Proportion: ${formatNumberWithLabel({ value: proportions, range: true, withoutLabel: true })}`;
      label = formatNumberWithLabel({ label: 'combination', value: resultInfo.length });
    } else if (Array.isArray(resultInfo) && resultInfo.length === 1) {
      const entry = resultInfo[0];
      const personCount = get(entry, 'PERSON_COUNT') || 0;
      const timeAtRisk = get(entry, 'TIME_AT_RISK') || 0;
      const cases = get(entry, 'CASES') || 0;
      const rate = get(entry, 'RATE') || 0;
      const proportion = get(entry, 'PROPORTION') || 0;
      tooltipString = `Rate: ${formatNumberWithLabel({ value: rate, withoutLabel: true })}
  ${formatNumberWithLabel({ value: cases, label: 'Case', pre: true })}
  ${formatNumberWithLabel({ value: personCount, label: 'Person', pre: true })}
  Time at risk:  ${formatNumberWithLabel({ value: timeAtRisk, withoutLabel: true })}
  Proportion:  ${formatNumberWithLabel({ value: proportion, withoutLabel: true })}`;
      label = `${formatNumberWithLabel({ label: 'case', value: cases, format: 'short' })}, ${formatNumberWithLabel({ label: 'person', value: personCount, format: 'short' })}`;
    } else {
      return this.Default();
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
