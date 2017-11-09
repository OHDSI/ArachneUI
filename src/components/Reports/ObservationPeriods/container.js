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

import { connect } from 'react-redux';
import { chart } from '@ohdsi/atlascharts/dist/atlascharts.umd';
import ReportUtils from 'components/Reports/Utils';
import ObservationPeriods from './presenter';

function mapStateToProps(state, ownProps) {
  let {
    ageByGender,
    durationByGender,
    durationByAgeDecline,
  } = ownProps;
  const {
    ageAtFirstObservation,
    observationLength,
    rawCumulativeObservation,
    durationByYear,
    observationsPerPerson,
    rawObservationsByMonth,
  } = ownProps;

  const ageData = chart.normalizeDataframe(ageByGender);
  const durationData = chart.normalizeDataframe(durationByGender);
  const durationDataDecline = chart.normalizeDataframe(durationByAgeDecline);

  if (ageByGender) {
    ageByGender = chart.prepareData(ageData, chart.chartTypes.BOXPLOT);
  }
  if (durationByGender) {
    durationByGender = chart.prepareData(durationData, chart.chartTypes.BOXPLOT);
  }
  if (durationByAgeDecline) {
    durationByAgeDecline = chart.prepareData(durationDataDecline, chart.chartTypes.BOXPLOT);
  }

  let cumulativeObservation = null;
  if (rawCumulativeObservation) {
    cumulativeObservation = [{
      name: '',
      values: rawCumulativeObservation.SERIES_NAME.map((name, i) => ({
        Y_PERCENT_PERSONS: rawCumulativeObservation.Y_PERCENT_PERSONS[i],
        X_LENGTH_OF_OBSERVATION: rawCumulativeObservation.X_LENGTH_OF_OBSERVATION[i],
      })),
    }];
  }

  let observationsByMonth = null;
  if (rawObservationsByMonth) {
    observationsByMonth = chart.mapMonthYearDataToSeries(rawObservationsByMonth, {
      dateField: 'MONTH_YEAR',
      yValue: 'COUNT_VALUE',
      yPercent: 'PERCENT_VALUE',
    });
  }

  return {
    ageAtFirstObservation,
    ageByGender,
    durationByGender,
    observationLength,
    cumulativeObservation,
    durationByAgeDecline,
    durationByYear,
    observationsPerPerson: ReportUtils.prepareChartDataForDonut(observationsPerPerson),
    observationsByMonth,
  };
}

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(ObservationPeriods);
