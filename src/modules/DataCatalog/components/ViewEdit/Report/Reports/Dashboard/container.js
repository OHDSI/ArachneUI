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
 * Created: May 29, 2017
 *
 */

import { connect } from 'react-redux';
import get from 'lodash/get';
import { chart } from '@ohdsi/atlascharts/dist/atlascharts.umd';
import { Utils } from 'services/Utils';
import Dashboard from './presenter';

function mapStateToProps(state) {
  const reportData = get(state, 'dataCatalog.report.data.result', {});
  const ageAtFirstObservation = get(reportData, 'AGE_AT_FIRST_OBSERVATION_HISTOGRAM');
  const cumulativeDuration = get(reportData, 'CUMULATIVE_DURATION');
  const genderData = get(reportData, 'GENDER_DATA');
  let observedByMonth = get(reportData, 'OBSERVED_BY_MONTH');
  const summary = get(reportData, 'SUMMARY');

  if (observedByMonth) {
    observedByMonth = chart.mapMonthYearDataToSeries(observedByMonth, {
      dateField: 'MONTH_YEAR',
      yValue: 'COUNT_VALUE',
      yPercent: 'PERCENT_VALUE',
    });
  }
  const characterizationDate = get(state, 'dataCatalog.characterization.data.result.date', Date.now()) || Date.now();

  return {
    ageAtFirstObservation,
    cumulativeDuration,
    genderData: Utils.prepareChartDataForDonut(genderData),
    observedByMonth,
    summary,
    characterizationDate,
  };
}

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
