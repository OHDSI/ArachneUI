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
 * Created: June 08, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Panel,
} from 'arachne-components';
import {
  boxplot,
  line,
  trellisline,
} from '@ohdsi/atlascharts/dist/atlascharts.umd';
import { numberFormatter } from 'services/Utils';
import * as d3 from 'd3';
import { chartSettings, defaultTrellisSet } from 'modules/DataCatalog/const';

function DrugEraDetails(props) {
  const {
    drugPrevalence,
    exposureByMonth,
    lengthOfEra,
    ageOfFirstExposure,
  } = props;
  const classes = new BEMHelper('report-death');
  const emptyClasses = new BEMHelper('report-empty');

  return (  
    <div {...classes({ extra: 'row' })}>
      <div className='col-xs-12'>
        <Panel title='Drug Prevalence' {...classes('chart')}>
          <div ref={(element) => {
            if (element && drugPrevalence) {
              const dimensions = element.getBoundingClientRect();
              new trellisline().render(
                drugPrevalence,
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
          className={!drugPrevalence ? emptyClasses().className : ''}>
            {!drugPrevalence &&
              <span {...emptyClasses('text')}>No data</span>
            }
          </div>
        </Panel>
      </div>
      <div className='col-xs-12'>
        <Panel title='Drug exposure Prevalence by Month' {...classes('chart')}>
          <div ref={(element) => {
            if (element && exposureByMonth) {
              const dimensions = element.getBoundingClientRect();
              new line().render(
                exposureByMonth,
                element,
                dimensions.width,
                dimensions.width/4,
                {
                  ...chartSettings,
                  yLabel: 'Prevalence per 1000 People',
                  xLabel: 'Date',
                  yFormat: d => numberFormatter.format(d, 'short'),
                  xFormat: d3.timeFormat('%m/%Y'),
                  tickFormat: d3.timeFormat('%Y'),
                  xScale: d3.scaleTime().domain(d3.extent(exposureByMonth[0].values, d => d.xValue)),
                }
              );
            }
          }}
          className={!exposureByMonth ? emptyClasses().className : ''}>
            {!exposureByMonth &&
              <span {...emptyClasses('text')}>No data</span>
            }
          </div>
        </Panel>
      </div>
      <div className='col-xs-6'>
        <Panel title='Age at First exposure' {...classes('chart')}>
          <div ref={(element) => {
            if (element && ageOfFirstExposure) {
              const dimensions = element.getBoundingClientRect();
              new boxplot().render(
                ageOfFirstExposure,
                element,
                dimensions.width,
                dimensions.width/2,
                {
                  ...chartSettings,
                  xLabel: 'Age at first diagnosis',
                  yLabel: 'Gender',
                  yFormat: d => numberFormatter.format(d, 'short')
                }
              );
            }
          }}
          className={!ageOfFirstExposure ? emptyClasses().className : ''}>
            {!ageOfFirstExposure &&
              <span {...emptyClasses('text')}>No data</span>
            } 
          </div>
        </Panel>
      </div>
      <div className='col-xs-6'>
        <Panel title='Length of Era distribution' {...classes('chart')}>
          <div ref={(element) => {
            if (element && lengthOfEra) {
              const dimensions = element.getBoundingClientRect();
              new boxplot().render(
                lengthOfEra,
                element,
                dimensions.width,
                dimensions.width/2,                
                {
                  ...chartSettings,
                  yLabel: 'Days',
                  xLabel: '',
                  yFormat: d => numberFormatter.format(d, 'short')
                },
              );
            }
          }}
          className={!lengthOfEra ? emptyClasses().className : ''}>
            {!lengthOfEra &&
              <span {...emptyClasses('text')}>No data</span>
            }
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default DrugEraDetails;
