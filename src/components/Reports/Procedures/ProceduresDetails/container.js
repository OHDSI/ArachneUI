/*
 *
 * Copyright 2018 Observational Health Data Sciences and Informatics
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
  convertDataToMonthLineChartData,
  convertDataToTrellislineData,
  convertDataToBoxplotData,
} from 'components/Reports/converters';
import ConditionDetails from './presenter';

const conditionByMonthDTO = {
  dateField: 'X_CALENDAR_MONTH',
  yValue: 'Y_PREVALENCE_1000PP',
  yPercent: 'Y_PREVALENCE_1000PP',
};

function mapStateToProps(state, ownProps) {
  const {
    proceduresByType,
    conditionPrevalence: rawConditionPrevalence,
    conditionByMonth,
    ageOfFirstOccurrence,
  } = ownProps;

  const {
    data: conditionPrevalence,
  } = convertDataToTrellislineData(
    rawConditionPrevalence
  );

  return {
    proceduresByType:
      ReportUtils.prepareChartDataForDonut(
        proceduresByType
      ),
    conditionByMonth:
      convertDataToMonthLineChartData(
        conditionByMonth, conditionByMonthDTO
      ),
    conditionPrevalence,
    ageOfFirstOccurrence:
    convertDataToBoxplotData(
        ageOfFirstOccurrence
      ),
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(ConditionDetails);
