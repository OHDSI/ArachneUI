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

import { connect } from 'react-redux';
import ReportUtils from 'components/Reports/Utils';
import {
  convertDataToBoxplotData,
  convertDataToTrellislineData,
  convertDataToMonthLineChartData,
} from 'components/Reports/converters';
import isEmpty from 'lodash/isEmpty';
import Death from './presenter';

const deathByMonthDTO = {
  dateField: 'X_CALENDAR_MONTH',
  yValue: 'Y_PREVALENCE_1000PP',
  yPercent: 'Y_PREVALENCE_1000PP',
};

function mapStateToProps(state, ownProps) {
  const {
    ageOfDeath: rawAgeOfDeath,
    deathByMonth,
    deathByType,
    deathByAge: rawDeathByAge,
  } = ownProps;
  let deathByAge = null;
  let ageOfDeath = null;

  if (rawDeathByAge && !isEmpty(rawDeathByAge)) {
    const { data } = convertDataToTrellislineData(
      rawDeathByAge
    );
    deathByAge = data;
  }

  if (rawAgeOfDeath && !isEmpty(rawAgeOfDeath)) {
    ageOfDeath = convertDataToBoxplotData(rawAgeOfDeath);
  }

  return {
    deathByAge,
    deathByMonth:
      convertDataToMonthLineChartData(
        deathByMonth,
        deathByMonthDTO
      ),
    deathByType:
      ReportUtils.prepareChartDataForDonut(
        deathByType
      ),
    ageOfDeath,
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Death);
