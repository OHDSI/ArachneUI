/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
import { get } from 'services/Utils';
import ObservationPeriods from './presenter';

function mapStateToProps(state) {
  const reportData = get(state, 'dataCatalog.report.data.result', {});
  const ageAtFirstObservation = get(reportData, 'AGE_AT_FIRST_OBSERVATION_HISTOGRAM');
  const ageByGender = get(reportData, 'AGE_BY_GENDER');
  const durationByGender = get(reportData, 'OBSERVATION_PERIOD_LENGTH_BY_GENDER');
  const observationLength = get(reportData, 'OBSERVATION_LENGTH_HISTOGRAM');
  const rawCumulativeObservation = get(reportData, 'CUMULATIVE_DURATION');
  const durationByAgeDecline = get(reportData, 'OBSERVATION_PERIOD_LENGTH_BY_AGE');
  const durationByYear = get(reportData, 'OBSERVED_BY_YEAR_HISTOGRAM');
  const observationsPerPerson = get(reportData, 'PERSON_PERIODS_DATA');
  const observationsByMonth = get(reportData, 'OBSERVED_BY_MONTH');

  return {
    ageAtFirstObservation,
    ageByGender,
    durationByGender,
    observationLength,
    rawCumulativeObservation,
    durationByAgeDecline,
    durationByYear,
    observationsPerPerson,
    observationsByMonth,
  };
}

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(ObservationPeriods);
