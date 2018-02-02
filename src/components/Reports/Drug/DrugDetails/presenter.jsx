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
  Panel,
} from 'arachne-ui-components';
import {
  boxplot,
  donut,
  line,
  trellisline,
} from '@ohdsi/atlascharts/dist/atlascharts.umd';
import { numberFormatter } from 'services/Utils';
import * as d3 from 'd3';
import { chartSettings, defaultTrellisSet } from 'modules/DataCatalog/const';
import Chart from 'components/Reports/Chart';
import isEmpty from 'lodash/isEmpty';

function DrugDetails(props) {
  const {
    drugPrevalence,
    exposureByMonth,
    lengthOfEra,
    ageOfFirstExposure,
    daysSupplyDistribution,
    quantity,
    refills,
    drugsByType,
		drugPrevalenceChart,
		exposureByMonthChart,
		ageOfFirstExposureChart,
		daysSupplyDistributionChart,
		quantityChart,
		refillsChart,
		drugsByTypeChart,
  } = props;
  const classes = new BEMHelper('report-death');
  const emptyClasses = new BEMHelper('report-empty');

  return (
    <div {...classes({ extra: 'row' })}>
      <div className='col-xs-12'>
        <Chart
          title='Drug Prevalence'
          isDataPresent={!isEmpty(drugPrevalence)}
          render={({ width, element }) => {
            drugPrevalenceChart.render(
              drugPrevalence,
              element,
              width,
              width/3,
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
          }}
        />
      </div>
      <div className='col-xs-12'>
        <Chart
          title='Drug exposure Prevalence by Month'
          isDataPresent={!isEmpty(exposureByMonth)}
          render={({ width, element }) => {
            exposureByMonthChart.render(
              exposureByMonth,
              element,
              width,
              width/3,
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
          }}
        />
      </div>
      <div className='col-xs-6'>
        <Chart
          title='Age at First exposure'
          isDataPresent={!isEmpty(ageOfFirstExposure)}
          render={({ width, element }) => {
            ageOfFirstExposureChart.render(
              ageOfFirstExposure,
              element,
              width,
              width/2,
              {
                ...chartSettings,
                xLabel: 'Age at first exposure',
                yLabel: 'Gender',
                yFormat: d => numberFormatter.format(d, 'short')
              }
            );
          }}
        />
      </div>
      <div className='col-xs-6'>
        <Chart
          title='Days supply'
          isDataPresent={!isEmpty(daysSupplyDistribution)}
          render={({ width, element }) => {
            daysSupplyDistributionChart.render(
              daysSupplyDistribution,
              element,
              width,
              width/2,
              {
                ...chartSettings,
                xLabel: 'Days supply',
                yLabel: 'Days',
                yFormat: d => numberFormatter.format(d, 'short')
              }
            );
          }}
        />
      </div>      
      <div className='col-xs-6'>
        <Chart
          title='Quantity'
          isDataPresent={!isEmpty(quantity)}
          render={({ width, element }) => {
            quantityChart.render(
              quantity,
              element,
              width,
              width/2,
              {
                ...chartSettings,
                xLabel: 'Quantity',
                yLabel: 'Quantity',
                yFormat: d => numberFormatter.format(d, 'short')
              }
            );
          }}
        />
      </div>
      <div className='col-xs-6'>
        <Chart
          title='Refills'
          isDataPresent={!isEmpty(refills)}
          render={({ width, element }) => {
            refillsChart.render(
              refills,
              element,
              width,
              width/2,
              {
                ...chartSettings,
                xLabel: 'Age at first diagnosis',
                yLabel: 'Gender',
                yFormat: d => numberFormatter.format(d, 'short')
              }
            );
          }}
        />
      </div>      
      <div className='col-xs-6'>
        <Chart
          title='Age at First exposure'
          isDataPresent={!isEmpty(drugsByType)}
          render={({ width, element }) => {
            drugsByTypeChart.render(
              drugsByType,
              element,
              width,
              width*0.75,
              chartSettings,
            );
          }}
        />
      </div>
    </div>
  );
}

export default DrugDetails;
