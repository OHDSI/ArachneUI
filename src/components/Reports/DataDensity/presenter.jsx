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
import {
  boxplot,
  line,
} from '@ohdsi/atlascharts/dist/atlascharts.umd';
import { numberFormatter } from 'services/Utils';
import * as d3 from 'd3';
import { chartSettings } from 'modules/DataCatalog/const';
import Chart from 'components/Reports/Chart';
import { chartTime } from 'const/formats';

require('./style.scss');

function DataDensity(props) {
  const {
    conceptsPerPerson,
    recordsPerPerson,
    recordsPerPersonYears,
    totalRecords,
    totalRecordsYears,
    detailsCharts,
  } = props;
  const {
    totalRecordsChart,
    recordsPerPersonChart,
    conceptsPerPersonChart,
  } = detailsCharts;
  const classes = new BEMHelper('report-observation-data-density');

  return (  
    <div {...classes({ extra: 'row' })}>
      <div className='col-xs-12'>
        <Chart
          title='Total Rows'
          {...classes('chart')}
          isDataPresent={totalRecords && totalRecords.length > 0}
          render={({ width, element }) => {
            totalRecordsChart.render(
              totalRecords,
              element,
              width,
              width / 4,
              {
                yValue: 'Y_RECORD_COUNT',
                xValue: 'X_CALENDAR_MONTH',
                yLabel: '# of records',
                xLabel: 'Year',
                xFormat: d3.timeFormat('%m/%Y'),
                yFormat: d => numberFormatter.format(d, 'short'),
                xScale: d3.scaleTime().domain(d3.extent(totalRecordsYears, d => d.X_CALENDAR_MONTH)),
                tickFormat: d3.timeFormat(chartTime),
                showLegend: true,
                colors: d3.scaleOrdinal()
                  .range(d3.schemeCategory10),
                ...chartSettings,
              }
            );
          }}
        />
      </div>
      <div className='col-xs-12'>
        <Chart
          title='Records Per Person'
          {...classes('chart')}
          isDataPresent={recordsPerPerson && recordsPerPerson.length > 0}
          render={({ width, element }) => {
            recordsPerPersonChart.render(
              recordsPerPerson,
              element,
              width, // Scrollbar width
              width / 4,
              {
                yValue: 'Y_RECORD_COUNT',
                xValue: 'X_CALENDAR_MONTH',
                yLabel: 'Percent per person',
                xLabel: 'Year',
                xFormat: d3.timeFormat('%m/%Y'),
                yFormat: d => numberFormatter.format(d, 'short'),
                xScale: d3.scaleTime().domain(d3.extent(recordsPerPersonYears, d => d.X_CALENDAR_MONTH)),
                tickFormat: d3.timeFormat(chartTime),
                showLegend: true,
                colors: d3.scaleOrdinal()
                  .range(d3.schemeCategory10),
                ...chartSettings,
              }
            );
          }}
        />
      </div>
      <div className='col-xs-12'>
        <Chart
          title='Concepts Per Person'
          {...classes('chart')}
          isDataPresent={conceptsPerPerson && conceptsPerPerson.length > 0}
          render={({ width, element }) => {
            conceptsPerPersonChart.render(
              conceptsPerPerson,
              element,
              width,
              width / 4,
              {
                yLabel: 'Percent of population',
                xLabel: 'Days',
                yFormat: d => numberFormatter.format(d, 'short'),
                ...chartSettings,
              }
            );
          }}
        />
      </div>
    </div>
  );
}

export default DataDensity;
