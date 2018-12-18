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
  boxplot,
  line,
} from '@ohdsi/atlascharts/dist/atlascharts.umd';
import { numberFormatter } from 'services/Utils';
import * as d3 from 'd3';
import { chartSettings } from 'modules/DataCatalog/const';
import Chart from 'components/Reports/Chart';
import isEmpty from 'lodash/isEmpty';
import { chartTime } from 'const/formats';

require('./style.scss');

function ObservationPeriods(props) {
  const {
    ageAtFirstObservation,
    ageByGender,
    durationByGender,
    observationLength,
    cumulativeObservation,
    durationByAgeDecline,
    durationByYear,
    observationsPerPerson,
    observationsByMonth,
    detailsCharts,
   } = props;
  const {
    ageAtFirstObservationChart,
    ageByGenderChart,
    observationLengthChart,
    durationByGenderChart,
    cumulativeObservationChart,
    durationByAgeDeclineChart,
    durationByYearChart,
    observationsPerPersonChart,
    observationsByMonthChart,
  } = detailsCharts;
  const classes = new BEMHelper('report-observation-periods');
  const emptyClasses = new BEMHelper('report-empty');

  return (  
    <div {...classes({ extra: 'row' })}>
      <div className='col-xs-8'>
        <Chart
          title='Age at First Observation'
          isDataPresent={!isEmpty(ageAtFirstObservation)}
          render={({ width, element }) => {
            ageAtFirstObservationChart.render(
              histogram.mapHistogram(ageAtFirstObservation),
              element,
              width,
              width/3,
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
      <div className='col-xs-4'>
        <Chart
          title='Age by Gender'
          isDataPresent={!isEmpty(ageByGender)}
          render={({ width, element }) => {
            ageByGenderChart.render(
              ageByGender,
              element,
              width, // Scrollbar width
              width/2,
              {
                ...chartSettings,
                xLabel: 'Gender',
                yLabel: 'Age',
                yFormat: d => numberFormatter.format(d, 'short')
              }
            );
          }}
        />
      </div>
      <div className='col-xs-8'>
        <Chart
          title='Observation length'
          isDataPresent={!isEmpty(observationLength)}
          render={({ width, element }) => {
            observationLengthChart.render(
              histogram.mapHistogram(observationLength),
              element,
              width,
              width/3,
              {
                ...chartSettings,
                xLabel: 'Days',
                yLabel: 'People',
                yFormat: d => numberFormatter.format(d, 'short')
              }
            );
          }}
        />
      </div>
      <div className='col-xs-4'>
        <Chart
          title='Duration by Gender'
          isDataPresent={!isEmpty(durationByGender)}
          render={({ width, element }) => {
            durationByGenderChart.render(
              durationByGender,
              element,
              width, // Scrollbar width
              width/2,
              {
                ...chartSettings,
                xLabel: 'Gender',
                yLabel: 'Days',
                yFormat: d => numberFormatter.format(d, 'short')
              }
            );
          }}
        />
      </div>
      <div className='col-xs-6'>
        <Chart
          title='Cumulative observation'
          isDataPresent={!isEmpty(cumulativeObservation)}
          render={({ width, element }) => {
            cumulativeObservationChart.render(
              cumulativeObservation,
              element,
              width, // Scrollbar width
              width/2,
              {
                ...chartSettings,
                yValue: 'Y_PERCENT_PERSONS',
                xValue: 'X_LENGTH_OF_OBSERVATION',
                yLabel: 'Percent of population',
                xLabel: 'Days',
                yFormat: d => numberFormatter.format(d, 'short')
              }
            );
          }}
        />
      </div>
      <div className='col-xs-6'>
        <Chart
          title='Duration by age decline'
          isDataPresent={!isEmpty(durationByAgeDecline)}
          render={({ width, element }) => {
            durationByAgeDeclineChart.render(
              durationByAgeDecline,
              element,
              width, // Scrollbar width
              width/2,
              {
                ...chartSettings,
                xLabel: 'Gender',
                yLabel: 'Days',
                yFormat: d => numberFormatter.format(d, 'short')
              }
            );
          }}
        />
      </div>
      <div className='col-xs-8'>
        <Chart
          title='Persons With Continuous Observation By Year'
          isDataPresent={!isEmpty(durationByYear)}
          render={({ width, element }) => {
            durationByYearChart.render(
              histogram.mapHistogram(durationByYear),
              element,
              width, // Scrollbar width
              width/3,
              {
                ...chartSettings,
                xFormat: d3.timeFormat(chartTime),
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
          title='Observation Periods per Person'
          isDataPresent={!isEmpty(observationsPerPerson)}
          render={({ width, element }) => {
            observationsPerPersonChart.render(
              observationsPerPerson,
              element,
              width, // Scrollbar width
              width/2,
              {
                ...chartSettings,
                colors: d3.scaleOrdinal().range(d3.schemeCategory10),
              },
            );
          }}
        />
      </div>
      <div className='col-xs-12'>
        <Chart
          title='Persons With Continuous Observation By Month'
          isDataPresent={!isEmpty(observationsByMonth)}
          render={({ width, element }) => {
            observationsByMonthChart.render(
              observationsByMonth,
              element,
              width,
              width/4,
              {
                ...chartSettings,
                xScale: d3.scaleLinear().domain(
                  d3.extent(
                    observationsByMonth[0].values,
                    d => d.xValue
                  )
                ),
                ticks: 10,
                xLabel: 'Date',
                yLabel: 'People',                  
                xFormat: d3.timeFormat('%m/%Y'),
                tickFormat: d3.timeFormat(chartTime),
                yFormat: d => numberFormatter.format(d, 'short')
              }
            );
          }}
        />
      </div>
    </div>
  );
}

export default ObservationPeriods;
