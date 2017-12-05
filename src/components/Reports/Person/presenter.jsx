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
 * Created: May 30, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Panel,
} from 'arachne-ui-components';
import {
  donut,
  histogram,
} from '@ohdsi/atlascharts/dist/atlascharts.umd';
import { numberFormatter } from 'services/Utils';
import * as d3 from 'd3';
import { chartSettings } from 'modules/DataCatalog/const';
import Chart from 'components/Reports/Chart';

require('./style.scss');

function Person(props) {
  const {
    reportData,
    birthYear,
    ethnicity,
    genderData,
    race,
    summary,
    showSummary = true,
		birthYearChart,
		genderDataChart,
		raceChart,
		ethnicityChart,
  } = props;
  const classes = new BEMHelper('report-person');
  const emptyClasses = new BEMHelper('report-empty');

  return (  
    <div {...classes({ extra: 'row' })}>
      {showSummary &&
        <div className='col-xs-4'>
          <Panel title='Person Summary' {...classes('chart')}>
          {summary
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
              </div>
              ]
            : <div {...emptyClasses()}>
                <span {...emptyClasses('text')}>No data</span>
              </div>
          }
          </Panel>
        </div>
      }
      <div className='col-xs-8'>
        <Chart
          title='Year of birth'
          isDataPresent={birthYear}
          render={({ width, element }) => {
            birthYearChart.render(
              histogram.mapHistogram(birthYear),
              element,
              width,
              width/3,
              {
                ...chartSettings,
                xFormat: d3.timeFormat('%Y'),
                xLabel: 'Year',
                yLabel: 'People',
                yFormat: d => numberFormatter.format(d, 'short')
              }
            );
          }}
        />
      </div>
      <div className='col-xs-4'>
        <Chart
          title='Population by Gender'
          isDataPresent={genderData}
          render={({ width, element }) => {
            genderDataChart.render(
              genderData,
              element,
              width,
              width/2,
              chartSettings
            );
          }}
        />
      </div>
      <div className='col-xs-4'>
        <Chart
          title='Population by Race'
          isDataPresent={race}
          render={({ width, element }) => {
            raceChart.render(
              race,
              element,
              width,
              width/2,
              chartSettings
            );
          }}
        />
      </div>
      <div className='col-xs-4'>
        <Chart
          title='Population by Ethnicity'
          isDataPresent={ethnicity}
          render={({ width, element }) => {
            ethnicityChart.render(
              ethnicity,
              element,
              width, // Scrollbar width
              width/2,
              chartSettings
            );
          }}
        />
      </div>

    </div>
  );
}

export default Person;
