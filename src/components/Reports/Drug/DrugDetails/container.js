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
 * Created: November 09, 2017
 *
 */

import { connect } from 'react-redux';
import { chart } from '@ohdsi/atlascharts';
import ReportUtils from 'components/Reports/Utils';
import {
  convertDataToBoxplotData,
  convertDataToTrellislineData,
  convertDataToMonthLineChartData,
} from 'components/Reports/converters';
import DrugDetails from './presenter';

const exposureByMonthDTO = {
  dateField: 'X_CALENDAR_MONTH',
  yValue: 'Y_PREVALENCE_1000PP',
  yPercent: 'Y_PREVALENCE_1000PP',
};

function mapStateToProps(state, ownProps) {
  const {
    conditionPrevalence: rawConditionPrevalence,
    ageOfFirstExposure,
    daysSupplyDistribution,
    exposureByMonth,
    quantity,
    refills,
  } = ownProps;
  let {
    drugsByType,
  } = ownProps;

  if (drugsByType) {
    drugsByType = chart.normalizeDataframe(drugsByType);
  }

  const {
    data: drugPrevalence,
  } = convertDataToTrellislineData(
    rawConditionPrevalence
  );

  return {
    exposureByMonth:
      convertDataToMonthLineChartData(
        exposureByMonth,
        exposureByMonthDTO
      ),
    drugPrevalence,
    ageOfFirstExposure:
    convertDataToBoxplotData(
      ageOfFirstExposure
    ),
    daysSupplyDistribution:
    convertDataToBoxplotData(
      daysSupplyDistribution
    ),
    quantity:
    convertDataToBoxplotData(
      quantity
    ),
    refills:
      convertDataToBoxplotData(
        refills
      ),
    drugsByType: ReportUtils.prepareChartDataForDonut(drugsByType),
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(DrugDetails);
