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

import { connect } from 'react-redux';
import get from 'lodash/get';
import * as d3 from 'd3';
import { chart } from '@ohdsi/atlascharts/dist/atlascharts.umd';
import { Utils } from 'services/Utils';
import ConditionDetails from './presenter';

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
  let ageOfFirstDiagnosis = get(reportData, 'AGE_AT_FIRST_DIAGNOSIS');
  const conditionByType = get(reportData, 'CONDITIONS_BY_TYPE', { COUNT_VALUE: [], CONCEPT_NAME: [] });
  let conditionByMonth = get(reportData, 'PREVALENCE_BY_MONTH');
  const rawConditionPrevalence = get(reportData, 'PREVALENCE_BY_GENDER_AGE_YEAR');
  let conditionPrevalence;

  if (ageOfFirstDiagnosis) {
    ageOfFirstDiagnosis = chart.prepareData(ageOfFirstDiagnosis, chart.chartTypes.BOXPLOT);
  }

  if (conditionByMonth) {
    conditionByMonth = chart.mapMonthYearDataToSeries(conditionByMonth, {
      dateField: 'X_CALENDAR_MONTH',
      yValue: 'Y_PREVALENCE_1000PP',
      yPercent: 'Y_PREVALENCE_1000PP',
    });
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
    conditionPrevalence = nestByDecile.entries(normalizedSeries);
    // fill in gaps
    const yearRange = d3.range(minYear, maxYear, 1);

    conditionPrevalence.forEach((trellis) => {
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
    conditionByType: Utils.prepareChartDataForDonut(conditionByType),
    conditionByMonth,
    conditionPrevalence: conditionPrevalence.length ? conditionPrevalence : null,
    ageOfFirstDiagnosis,
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(ConditionDetails);
