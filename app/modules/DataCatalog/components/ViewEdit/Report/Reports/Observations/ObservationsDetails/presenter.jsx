/**
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
 * Created: June 07, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Panel,
} from 'arachne-components';
import {
  boxplot,
  donut,
  line,
  trellisline,
} from '@ohdsi/atlascharts/dist/atlascharts.umd';
import { numberFormatter } from 'services/Utils';
import * as d3 from 'd3';
import { chartSettings, defaultTrellisSet } from 'modules/DataCatalog/const';

function ConditionEraDetails(props) {
  const {
    conditionPrevalence,
    conditionByMonth,
    ageAtFirstOccurrence,
    observationsByType,
  } = props;
  const classes = new BEMHelper('report-death');
  const emptyClasses = new BEMHelper('report-empty');

  return (  
    <div {...classes({ extra: 'row' })}>
      <div className='col-xs-12'>
        <Panel title='Condition Prevalence' {...classes('chart')}>
          <div ref={(element) => {
            if (element && conditionPrevalence) {
              const dimensions = element.getBoundingClientRect();
              new trellisline().render(
                conditionPrevalence,
                element,
                dimensions.width,
                dimensions.width/3,
                {
                  ...chartSettings,
                  trellisSet: defaultTrellisSet,
                  trellisLabel: 'Age Decile',
                  seriesLabel: 'Year of Observation',
                  yLabel: 'Prevalence Per 1000 People',
                  xFormat: d3.timeFormat('%Y'),
                  yFormat: d3.format('0.2f'),
                  tickPadding: 20,
                  colors: d3.scaleOrdinal()
                    .domain(['MALE', 'FEMALE'])
                    .range(['#1f77b4', '#ff7f0e'])
                }
              )
            }
          }}
          className={!conditionPrevalence ? emptyClasses().className : ''}>
            {!conditionPrevalence &&
              <span {...emptyClasses('text')}>No data</span>
            }
          </div>
        </Panel>
      </div>
      <div className='col-xs-12'>
        <Panel title='Condition Prevalence by Month' {...classes('chart')}>
          <div ref={(element) => {
            if (element && conditionByMonth) {
              const dimensions = element.getBoundingClientRect();
              new line().render(
                conditionByMonth,
                element,
                dimensions.width,
                dimensions.width/3,
                {
                  ...chartSettings,
                  yLabel: 'Prevalence per 1000 People',
                  xLabel: 'Date',
                  yFormat: d => numberFormatter.format(d, 'short'),
                  xFormat: d3.timeFormat('%m/%Y'),
                  tickFormat: d3.timeFormat('%Y'),
                  xScale: d3.scaleTime().domain(d3.extent(conditionByMonth[0].values, d => d.xValue)),
                }
              );
            }
          }}
          className={!conditionByMonth ? emptyClasses().className : ''}>
            {!conditionByMonth &&
              <span {...emptyClasses('text')}>No data</span>
            }
          </div>
        </Panel>
      </div>
      <div className='col-xs-6'>
        <Panel title='Observations by type' {...classes('chart')}>
          <div ref={(element) => {
            if (element && observationsByType) {
              const dimensions = element.getBoundingClientRect();
              new donut().render(             
                observationsByType,
                element,
                dimensions.width,
                dimensions.width*0.75,
                chartSettings
              );
            }
          }}
          className={!observationsByType ? emptyClasses().className : ''}>
            {!observationsByType &&
              <span {...emptyClasses('text')}>No data</span>
            } 
          </div>
        </Panel>
      </div>
      <div className='col-xs-6'>
        <Panel title='Age at first occurrence' {...classes('chart')}>
          <div ref={(element) => {
            if (element && ageAtFirstOccurrence) {
              const dimensions = element.getBoundingClientRect();
              new boxplot().render(
                ageAtFirstOccurrence,
                element,
                dimensions.width,
                dimensions.width*0.75,
                {
                  ...chartSettings,
                  xLabel: 'Age at first occurrence',
                  yLabel: 'Gender',
                  yFormat: d => numberFormatter.format(d, 'short')
                },
              );
            }
          }}
          className={!ageAtFirstOccurrence ? emptyClasses().className : ''}>
            {!ageAtFirstOccurrence &&
              <span {...emptyClasses('text')}>No data</span>
            }
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default ConditionEraDetails;
