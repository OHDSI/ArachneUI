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
import ReportUtils from 'components/Reports/Utils';
import {
  convertDataToMonthLineChartData,
  convertDataToTrellislineData,
  convertDataToBoxplotData,
} from 'components/Reports/converters';
import MeasurementDetails from './presenter';

const conditionByMonthDTO = {
  dateField: 'X_CALENDAR_MONTH',
  yValue: 'Y_PREVALENCE_1000PP',
  yPercent: 'Y_PREVALENCE_1000PP',
};

function parseFrequencyDistribution(freqData) {
  const parsedData = {
    DATA: null,
    MIN: 0,
    MAX: 10,
    INTERVALS: 10,
    INTERVAL_SIZE: 1,
  };
  let yScaleMax = null;
  const frequencyHistData = {    
    countValue: [],
    intervalIndex: [],
    percentValue: [],
  };
  let totalCnt = 0;
  for (let i in freqData.Y_NUM_PERSONS) {
    totalCnt += freqData.Y_NUM_PERSONS[i];
  }
  frequencyHistData.COUNT_VALUE = freqData.Y_NUM_PERSONS.slice();
  frequencyHistData.INTERVAL_INDEX = freqData.X_COUNT.slice();
  frequencyHistData.PERCENT_VALUE = freqData.Y_NUM_PERSONS.map(function (value) {
    return (value / totalCnt) * 100;
  });
  parsedData.DATA = frequencyHistData;
  yScaleMax = (Math.floor((Math.max.apply(null, freqData.Y_NUM_PERSONS) + 5) / 10) + 1) * 10;

  return parsedData;
}

function mapStateToProps(state, ownProps) {
  const {
    measurementsByType,
    conditionPrevalence: rawConditionPrevalence,
    conditionByMonth,
    ageOfFirstOccurrence,
    frequencyDistribution,
    recordsByUnit,
    valuesRelativeToNorm,
    upperLimitDistribution,
    lowerLimitDistribution,
    measurementValueDistribution,
  } = ownProps;

  const {
    data: conditionPrevalence,
  } = convertDataToTrellislineData(
    rawConditionPrevalence
  );

  return {
    measurementsByType:
      ReportUtils.prepareChartDataForDonut(
        measurementsByType
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
    frequencyDistribution: parseFrequencyDistribution(frequencyDistribution),
    recordsByUnit: ReportUtils.prepareChartDataForDonut(
      recordsByUnit
    ),
    valuesRelativeToNorm: ReportUtils.prepareChartDataForDonut(
      valuesRelativeToNorm
    ),
    measurementValueDistribution: convertDataToBoxplotData(measurementValueDistribution),
    upperLimitDistribution: convertDataToBoxplotData(upperLimitDistribution),
    lowerLimitDistribution: convertDataToBoxplotData(lowerLimitDistribution),
  };
}

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(MeasurementDetails);
