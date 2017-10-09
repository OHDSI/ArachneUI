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
 * Created: June 01, 2017
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
} from '@ohdsi/atlascharts/dist/atlascharts.umd';
import { numberFormatter } from 'services/Utils';
import * as d3 from 'd3';
import { chartSettings } from 'modules/DataCatalog/const';

require('./style.scss');

function DataDensity(props) {
  const {
    conceptsPerPerson,
    recordsPerPerson,
    recordsPerPersonYears,
    totalRecords,
    totalRecordsYears,
  } = props;
  const classes = new BEMHelper('report-observation-data-density');
  const emptyClasses = new BEMHelper('report-empty');

  return (  
    <div {...classes({ extra: 'row' })}>
      <div className='col-xs-12'>
        <Panel title='Total Rows' {...classes('chart')}>
          <div ref={(element) => {
            if (element && totalRecords) {
              const dimensions = element.getBoundingClientRect();
              new line().render(
                totalRecords,
                element,
                dimensions.width, // Scrollbar width
                dimensions.width/4,
                {
                  yValue: 'Y_RECORD_COUNT',
                  xValue: 'X_CALENDAR_MONTH',
                  yLabel: '# of records',
                  xLabel: 'Year',
                  xFormat: d3.timeFormat('%m/%Y'),
                  yFormat: d => numberFormatter.format(d, 'short'),
                  xScale: d3.scaleTime().domain(d3.extent(totalRecordsYears, d => d.X_CALENDAR_MONTH)),
                  tickFormat: d3.timeFormat('%Y'),
                  showLegend: true,
                  colors: d3.scaleOrdinal()
                    .range(d3.schemeCategory10),
                  ...chartSettings,
                }
              );
            }
          }}
          className={!totalRecords ? emptyClasses().className : ''}>
            {!totalRecords &&
              <span {...emptyClasses('text')}>No data</span>
            }
          </div>
        </Panel>
      </div>
      <div className='col-xs-12'>
        <Panel title='Records Per Person' {...classes('chart')}>
          <div ref={(element) => {
            if (element && recordsPerPerson) {
              const dimensions = element.getBoundingClientRect();
              new line().render(
                recordsPerPerson,
                element,
                dimensions.width, // Scrollbar width
                dimensions.width/4,
                {
                  yValue: 'Y_RECORD_COUNT',
                  xValue: 'X_CALENDAR_MONTH',
                  yLabel: 'Percent per person',
                  xLabel: 'Year',
                  xFormat: d3.timeFormat('%m/%Y'),
                  yFormat: d => numberFormatter.format(d, 'short'),
                  xScale: d3.scaleTime().domain(d3.extent(recordsPerPersonYears, d => d.X_CALENDAR_MONTH)),
                  tickFormat: d3.timeFormat('%Y'),
                  showLegend: true,
                  colors: d3.scaleOrdinal()
                    .range(d3.schemeCategory10),
                  ...chartSettings,
                }
              );
            }
          }}
          className={!recordsPerPerson ? emptyClasses().className : ''}>
            {!recordsPerPerson &&
              <span {...emptyClasses('text')}>No data</span>
            }
          </div>
        </Panel>
      </div>
      <div className='col-xs-12'>
        <Panel title='Concepts Per Person' {...classes('chart')}>
          <div ref={(element) => {
            if (element && conceptsPerPerson) {
              const dimensions = element.getBoundingClientRect();
              new boxplot().render(
                conceptsPerPerson,
                element,
                dimensions.width,
                dimensions.width/4,
                {
                  yLabel: 'Percent of population',
                  xLabel: 'Days',
                  yFormat: d => numberFormatter.format(d, 'short'),
                  ...chartSettings,
                }
              );
            }
          }}
          className={!conceptsPerPerson ? emptyClasses().className : ''}>
            {!conceptsPerPerson &&
              <span {...emptyClasses('text')}>No data</span>
            }
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default DataDensity;
