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

import { connect } from 'react-redux';
import get from 'lodash/get';
import * as d3 from 'd3';
import { chart } from '@ohdsi/atlascharts/dist/atlascharts.umd';
import { Utils } from 'services/Utils';
import DrugDetails from './presenter';

function seriesInitializer(tName, sName, x, y) {
  return {
    TRELLIS_NAME: tName,
    SERIES_NAME: sName,
    X_CALENDAR_YEAR: x,
    Y_PREVALENCE_1000PP: y,
  };
}

function mapStateToProps(state) {
  const reportData = get(state, 'dataCatalog.reportDetails.data.result', {});
  let ageOfFirstExposure = get(reportData, 'AGE_AT_FIRST_EXPOSURE');
  let exposureByMonth = get(reportData, 'PREVALENCE_BY_MONTH');
  const rawConditionPrevalence = get(reportData, 'PREVALENCE_BY_GENDER_AGE_YEAR');
  let drugPrevalence;
  let daysSupplyDistribution = get(reportData, 'DAYS_SUPPLY_DISTRIBUTION');
  let quantity = get(reportData, 'QUANTITY_DISTRIBUTION');
  let refills = get(reportData, 'REFILLS_DISTRIBUTION');
  let drugsByType = get(reportData, 'DRUGS_BY_TYPE');

  if (ageOfFirstExposure) {
    ageOfFirstExposure = chart.prepareData(ageOfFirstExposure, chart.chartTypes.BOXPLOT);
  }

  if (exposureByMonth) {
    exposureByMonth = chart.mapMonthYearDataToSeries(
      chart.normalizeDataframe(exposureByMonth),
      {
        dateField: 'X_CALENDAR_MONTH',
        yValue: 'Y_PREVALENCE_1000PP',
        yPercent: 'Y_PREVALENCE_1000PP',
      }
    );
  }

  if (daysSupplyDistribution) {
    daysSupplyDistribution = chart.prepareData(
      chart.normalizeDataframe(daysSupplyDistribution),
      chart.chartTypes.BOXPLOT
    );
  }
  if (quantity) {
    quantity = chart.prepareData(
      chart.normalizeDataframe(quantity),
      chart.chartTypes.BOXPLOT
    );
  }
  if (refills) {
    refills = chart.prepareData(refills, chart.chartTypes.BOXPLOT);
  }
  if (drugsByType) {
    drugsByType = chart.normalizeDataframe(drugsByType);
  }

  if (rawConditionPrevalence) {
    const minYear = d3.min(rawConditionPrevalence.X_CALENDAR_YEAR);
    const maxYear = d3.max(rawConditionPrevalence.X_CALENDAR_YEAR);

    const nestByDecile = d3.nest()
      .key(d => d.TRELLIS_NAME)
      .key(d => d.SERIES_NAME)
      .sortValues((a, b) =>
        a.X_CALENDAR_YEAR - b.X_CALENDAR_YEAR
      );

    // map data into chartable form
    const normalizedSeries = chart.dataframeToArray(rawConditionPrevalence);
    drugPrevalence = nestByDecile.entries(normalizedSeries);
    // fill in gaps
    const yearRange = d3.range(minYear, maxYear, 1);

    drugPrevalence.forEach((trellis) => {
      trellis.values.forEach((series) => {
        series.values = yearRange.map((year) => { // eslint-disable-line no-param-reassign
          const yearData = series.values.filter(
            f => f.X_CALENDAR_YEAR == year // eslint-disable-line eqeqeq
          )[0] || seriesInitializer(trellis.key, series.key, year, 0);
          yearData.date = new Date(year, 0, 1);
          return yearData;
        });
      });
    });
  }

  return {
    exposureByMonth,
    drugPrevalence: drugPrevalence.length ? drugPrevalence : null,
    ageOfFirstExposure,
    daysSupplyDistribution,
    quantity,
    refills,
    drugsByType: Utils.prepareChartDataForDonut(drugsByType),
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(DrugDetails);
