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
 * Created: November 13, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  line,
  trellisline,
  boxplot,
} from '@ohdsi/atlascharts';
import * as d3 from 'd3';
import { numberFormatter } from 'services/Utils';
import { chartSettings } from 'const/reports';
import Chart from 'components/Reports/Chart';
import isEmpty from 'lodash/isEmpty';

import './style.scss';

export default function CohortspecificReport(props) {
  const {
    personsByDurationFromStartToEnd,
    prevalenceByMonth,
    ageAtIndexDistribution,
    distributionOfAgeAtCohortStartByGender,
    personsInCohortFromCohortStartToEnd,
    prevalenceByYearGenderSex,
    prevalenceByYearGenderSexSet,
    detailsCharts,
  } = props;
  const {
    prevalenceByMonthChart,
    prevalenceByYearGenderSexChart,
    personsInCohortFromCohortStartToEndChart,
    personsByDurationFromStartToEndChart,
    ageAtIndexDistributionChart,
    distributionOfAgeAtCohortStartByGenderChart,
  } = detailsCharts;
  const classes = BEMHelper('report-cohortspecific');

  return (
    <div {...classes()}>
      <div {...classes('row', null, 'row')}>
        <div className='col-xs-12'>
          <Chart
            title='Prevalence by Month'
            isDataPresent={!isEmpty(prevalenceByMonth)}
            render={({ width, element }) => {
              prevalenceByMonthChart.render(
                prevalenceByMonth,
                element,
                width, // Scrollbar width
                width / 4,
                {
                  yLabel: 'Prevalence per 1000 People',
                  xLabel: 'Date',
                  xFormat: d3.timeFormat('%m/%Y'),
                  yFormat: d => numberFormatter.format(d, 'short'),
                  xScale: d3.scaleTime().domain(d3.extent(prevalenceByMonth[0].values, d => d.xValue)),
                  tickFormat: d3.timeFormat('%m/%Y'),
                  showLegend: false,
                  colors: d3.scaleOrdinal()
                    .range(d3.schemeCategory10),
                  ...chartSettings,
                }
              );
            }}
          />
        </div>
      </div>
      <div {...classes('row', null, 'row')}>
        <div className='col-xs-12'>
          <Chart
            title='Number of Persons by Cohort Start'
            isDataPresent={!isEmpty(prevalenceByYearGenderSex)}
            render={({ width, element }) => {
              prevalenceByYearGenderSexChart.render(
                prevalenceByYearGenderSex,
                element,
                width,
                width/3,
                {
                  ...chartSettings,
                  trellisSet: prevalenceByYearGenderSexSet,
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
      </div>
      <div {...classes('row', null, 'row')}>
        <div className='col-xs-12'>
          <Chart
            title='Persons in cohort from start to end'
            isDataPresent={!isEmpty(personsInCohortFromCohortStartToEnd)}
            render={({ width, element }) => {
              personsInCohortFromCohortStartToEndChart.render(
                personsInCohortFromCohortStartToEnd,
                element,
                width, // Scrollbar width
                width / 4,
                {
                  yLabel: 'People',
                  xLabel: '30 Day Increments',
                  xFormat: d => numberFormatter.format(d, 'short'),
                  yFormat: d => numberFormatter.format(d, 'short'),
                  xScale: d3.scaleLinear().domain(d3.extent(
                    personsInCohortFromCohortStartToEnd[0].values, d => d.xValue)
                  ),
                  tickFormat: d => numberFormatter.format(d, 'short'),
                  showLegend: false,
                  colors: d3.scaleOrdinal()
                    .range(d3.schemeCategory10),
                  ...chartSettings,
                }
              );
            }}
          />
        </div>    
      </div>
      <div {...classes('row', null, 'row')}>
        <div className='col-xs-8'>
          <Chart
            title='Number of persons by duration from cohort start to cohort end'
            isDataPresent={!isEmpty(personsByDurationFromStartToEnd)}
            render={({ width, element }) => {
              personsByDurationFromStartToEndChart.render(
                personsByDurationFromStartToEnd,
                element,
                width, // Scrollbar width
                width / 2,
                {
                  yLabel: 'Percent of Population',
                  xLabel: 'Day',
                  xFormat: d => numberFormatter.format(d, 'short'),
                  yFormat: d => `${numberFormatter.format(d/100, 'short')}%`,
                  xScale: d3.scaleLinear().domain(d3.extent(
                    personsByDurationFromStartToEnd[0].values, d => d.xValue)
                  ),
                  tickFormat: d => numberFormatter.format(d, 'short'),
                  showLegend: false,
                  colors: d3.scaleOrdinal()
                    .range(d3.schemeCategory10),
                  ...chartSettings,
                }
              );
            }}
          />
        </div>
      </div>
      <div {...classes('row', null, 'row')}>
        <div className='col-xs-6'>
          <Chart
            title='Age at Index'
            isDataPresent={!isEmpty(ageAtIndexDistribution)}
            render={({ width, element }) => {
              ageAtIndexDistributionChart.render(
                ageAtIndexDistribution,
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
        <div className='col-xs-6'>
          <Chart
            title='Distribution of age at cohort start by gender '
            isDataPresent={!isEmpty(distributionOfAgeAtCohortStartByGender)}
            render={({ width, element }) => {
              distributionOfAgeAtCohortStartByGenderChart.render(
                distributionOfAgeAtCohortStartByGender,
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
      </div>
    </div>
  );
}
