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
  boxplot,
  line,
} from '@ohdsi/atlascharts/dist/atlascharts.umd';
import { numberFormatter } from 'services/Utils';
import * as d3 from 'd3';
import { chartSettings } from 'modules/DataCatalog/const';

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
  } = props;
  const classes = new BEMHelper('report-observation-periods');
  const emptyClasses = new BEMHelper('report-empty');

  return (  
    <div {...classes({ extra: 'row' })}>
      <div className='col-xs-8'>
        <Panel title='Age at First Observation' {...classes('chart')}>
          <div ref={(element) => {
            if (element && ageAtFirstObservation) {
              const dimensions = element.getBoundingClientRect();
              new histogram().render(
                histogram.mapHistogram(ageAtFirstObservation),
                element,
                dimensions.width,
                dimensions.width/3,
                {
                  ...chartSettings,
                  xLabel: 'Age',
                  yLabel: 'People',
                  yFormat: d => numberFormatter.format(d, 'short')
                }
              );
            }
          }}
          className={!ageAtFirstObservation ? emptyClasses().className : ''}>
            {!ageAtFirstObservation &&
              <span {...emptyClasses('text')}>No data</span>
            }
          </div>
        </Panel>
      </div>
      <div className='col-xs-4'>
        <Panel title='Age by Gender' {...classes('chart')}>
          <div ref={(element) => {
            if (element && ageByGender) {
              const dimensions = element.getBoundingClientRect();
              new boxplot().render(
                ageByGender,
                element,
                dimensions.width, // Scrollbar width
                dimensions.width/2,
                {
                  ...chartSettings,
                  xLabel: 'Gender',
                  yLabel: 'Age',
                  yFormat: d => numberFormatter.format(d, 'short')
                }
              );
            }
          }}
          className={!ageByGender ? emptyClasses().className : ''}>
            {!ageByGender &&
              <span {...emptyClasses('text')}>No data</span>
            }
          </div>
        </Panel>
      </div>
      <div className='col-xs-8'>
        <Panel title='Observation length' {...classes('chart')}>
          <div ref={(element) => {
            if (element && observationLength) {
              const dimensions = element.getBoundingClientRect();
              new histogram().render(
                histogram.mapHistogram(observationLength),
                element,
                dimensions.width,
                dimensions.width/3,
                {
                  ...chartSettings,
                  xLabel: 'Days',
                  yLabel: 'People',
                  yFormat: d => numberFormatter.format(d, 'short')
                }
              );
            }
          }}
          className={!observationLength ? emptyClasses().className : ''}>
            {!observationLength &&
              <span {...emptyClasses('text')}>No data</span>
            }
          </div>
        </Panel>
      </div>
      <div className='col-xs-4'>
        <Panel title='Duration by Gender' {...classes('chart')}>
          <div ref={(element) => {
            if (element && durationByGender) {
              const dimensions = element.getBoundingClientRect();
              new boxplot().render(
                durationByGender,
                element,
                dimensions.width, // Scrollbar width
                dimensions.width/2,
                {
                  ...chartSettings,
                  xLabel: 'Gender',
                  yLabel: 'Days',
                  yFormat: d => numberFormatter.format(d, 'short')
                }
              );
            }
          }}
          className={!durationByGender ? emptyClasses().className : ''}>
            {!durationByGender &&
              <span {...emptyClasses('text')}>No data</span>
            }
          </div>
        </Panel>
      </div>
      <div className='col-xs-6'>
        <Panel title='Cumulative observation' {...classes('chart')}>
          <div ref={(element) => {
            if (element && cumulativeObservation) {
              const dimensions = element.getBoundingClientRect();
              new line().render(
                cumulativeObservation,
                element,
                dimensions.width, // Scrollbar width
                dimensions.width/2,
                {
                  ...chartSettings,
                  yValue: 'Y_PERCENT_PERSONS',
                  xValue: 'X_LENGTH_OF_OBSERVATION',
                  yLabel: 'Percent of population',
                  xLabel: 'Days',
                  yFormat: d => numberFormatter.format(d, 'short')
                }
              );
            }
          }}
          className={!cumulativeObservation ? emptyClasses().className : ''}>
            {!cumulativeObservation &&
              <span {...emptyClasses('text')}>No data</span>
            }
          </div>
        </Panel>
      </div>
      <div className='col-xs-6'>
        <Panel title='Duration by age decline' {...classes('chart')}>
          <div ref={(element) => {
            if (element && durationByAgeDecline) {
              const dimensions = element.getBoundingClientRect();
              new boxplot().render(
                durationByAgeDecline,
                element,
                dimensions.width, // Scrollbar width
                dimensions.width/2,
                {
                  ...chartSettings,
                  xLabel: 'Gender',
                  yLabel: 'Days',
                  yFormat: d => numberFormatter.format(d, 'short')
                }
              );
            }
          }}
          className={!durationByAgeDecline ? emptyClasses().className : ''}>
            {!durationByAgeDecline &&
              <span {...emptyClasses('text')}>No data</span>
            }
          </div>
        </Panel>
      </div>
      <div className='col-xs-8'>
        <Panel title='Persons With Continuous Observation By Year' {...classes('chart')}>
          <div ref={(element) => {
            if (element && durationByYear) {
              const dimensions = element.getBoundingClientRect();
              new histogram().render(
                histogram.mapHistogram(durationByYear),
                element,
                dimensions.width, // Scrollbar width
                dimensions.width/3,
                {
                  ...chartSettings,
                  xFormat: d3.timeFormat('%Y'),
                  xLabel: 'Year',
                  yLabel: 'People',
                  yFormat: d => numberFormatter.format(d, 'short')
                }
              );
            }
          }}
          className={!durationByYear ? emptyClasses().className : ''}>
            {!durationByYear &&
              <span {...emptyClasses('text')}>No data</span>
            }
          </div>
        </Panel>
      </div>
      <div className='col-xs-4'>
        <Panel title='Observation Periods per Person' {...classes('chart')}>
          <div ref={(element) => {
            if (element && observationsPerPerson) {
              const dimensions = element.getBoundingClientRect();
              new donut().render(
                observationsPerPerson,
                element,
                dimensions.width, // Scrollbar width
                dimensions.width/2,
                chartSettings,
              );
            }
          }}
          className={!observationsPerPerson ? emptyClasses().className : ''}>
            {!observationsPerPerson &&
              <span {...emptyClasses('text')}>No data</span>
            }
          </div>
        </Panel>
      </div>
      <div className='col-xs-12'>
        <Panel title='Persons With Continuous Observation By Month' {...classes('chart')}>
          <div ref={(element) => {
            if (element && observationsByMonth) {
              const dimensions = element.getBoundingClientRect();
              new line().render(
                observationsByMonth,
                element,
                dimensions.width,
                dimensions.width/4,
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
                  tickFormat: d3.timeFormat('%Y'),
                  yFormat: d => numberFormatter.format(d, 'short')
                }
              );
            }
          }}
          className={!observationsByMonth ? emptyClasses().className : ''}>
            {!observationsByMonth &&
              <span {...emptyClasses('text')}>No data</span>
            }
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default ObservationPeriods;
