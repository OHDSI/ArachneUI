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
 * Created: November 09, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import * as d3 from 'd3';
import * as d3scale from 'd3-scale';
import {
  Panel,
} from 'arachne-ui-components';
import {
  donut,
  histogram,
  line,
} from '@ohdsi/atlascharts/dist/atlascharts.umd';
import { numberFormatter, get } from 'services/Utils';
import { chartSettings } from 'components/Reports/const';
import moment from 'moment';
import { commonDate } from 'const/formats';
import Chart from 'components/Reports/Chart';

require('./style.scss');

function Dashboard(props) {
  const {
    ageAtFirstObservation,
    cumulativeDuration,
    genderData,
    observedByMonth,
    summary,
    characterizationDate,
    showSummary = true,
  } = props;
  const classes = new BEMHelper('report-dashboard');
  const emptyClasses = new BEMHelper('report-empty');

  return (  
    <div {...classes({ extra: 'row' })}>
      {showSummary &&
        <div className='col-xs-6'>
          <Panel title='CDM Summary' {...classes('chart')}>
            {(summary && Array.isArray(get(summary, 'ATTRIBUTE_NAME')))
              ? [
                <div {...classes('summary-row')}>
                  <span {...classes('summary-col', 'title')}>{summary.ATTRIBUTE_NAME[0]}</span>
                  <span {...classes('summary-col')}>
                    {summary.ATTRIBUTE_VALUE[0]}
                  </span>
                </div>,
                <div {...classes('summary-row')}>
                  <span {...classes('summary-col', 'title')}>{summary.ATTRIBUTE_NAME[1]}</span>
                  <span {...classes('summary-col')}>
                    {numberFormatter.format(parseInt(summary.ATTRIBUTE_VALUE[1], 0), 'short')}
                  </span>
                </div>,
                <div {...classes('summary-row')}>
                  <span {...classes('summary-col', 'title')}>
                    Last update
                  </span>
                  <span {...classes('summary-col')}>
                    {moment(characterizationDate).format(commonDate)}
                  </span>
                </div>
                ]
              : <div {...emptyClasses()}>
                  <span {...emptyClasses('text')}>No data</span>
                </div>
            }
          </Panel>
        </div>
      }
      <div className='col-xs-6'>
        <Chart
          title='Population by Gender'
          isDataPresent={genderData}
          render={({ width, element }) => {
            new donut().render(
              genderData,
              element,
              width,
              width/3,
              chartSettings
            );
          }}
        />
      </div>
      <div className='col-xs-12'>
        <Chart
          title='Age at First Observation'
          isDataPresent={ageAtFirstObservation}
          render={({ width, element }) => {
            new histogram().render(
              histogram.mapHistogram(ageAtFirstObservation),
              element,
              width,
              width/4,
              {
                ...chartSettings,
                xLabel: 'Age',
                yLabel: 'People',
                yFormat: d => numberFormatter.format(d, 'short')
              }
            );
          }}
        />
      </div>
      <div className='col-xs-12'>
        <Chart
          title='Persons With Continuous Observation By Month'
          isDataPresent={observedByMonth}
          render={({ width, element }) => {
            new line().render(
              observedByMonth,
              element,
              width,
              width/4,
              {
                ...chartSettings,
                xScale: d3scale.scaleLinear().domain(
                  d3.extent(observedByMonth[0].values, d => d.xValue)
                ),
                xFormat: d3.timeFormat('%m/%Y'),
                tickFormat: d3.timeFormat('%Y'),
                ticks: 10,
                xLabel: 'Date',
                yLabel: 'People',
                yFormat: d => numberFormatter.format(d, 'short')
              }
            );
          }}
        />
      </div>
      <div className='col-xs-12'>
        <Chart
          title='Cumulative Observation'
          isDataPresent={cumulativeDuration}
          render={({ width, element }) => {
            new line().render(
              cumulativeDuration,
              element,
              width,
              width/4,
              {
                ...chartSettings,
                yValue: 'Y_PERCENT_PERSONS',
                xValue: 'X_LENGTH_OF_OBSERVATION',
                yLabel: 'Percent of population',
                xLabel: 'Days',
              }
            );
          }}
        />
      </div>
    </div>
  );
}

export default Dashboard;
