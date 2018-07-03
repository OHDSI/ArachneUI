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

import ReportUtils from 'components/Reports/Utils';
import { convertDataToMonthLineChartData } from 'components/Reports/converters';
import {
  donut,
  histogram,
  line,
} from '@ohdsi/atlascharts/dist/atlascharts.umd';
import { ContainerBuilder } from 'services/Utils';
import { BaseChart } from 'components/Reports/BaseChart';
import presenter from './presenter';

class Dashboard extends BaseChart {
  render() {
    return presenter(this.props);
  }
}

const observedByMonthDTO = {
  dateField: 'MONTH_YEAR',
  yValue: 'COUNT_VALUE',
  yPercent: 'PERCENT_VALUE',
};

export default class DashboardContainerBuilder extends ContainerBuilder {
  constructor() {
    super();
    this.detailsCharts = {
      genderDataChart: new donut(),
      ageAtFirstObservationChart: new histogram(),
      observedByMonthChart: new line(),
      cumulativeDurationChart: new line(),
    };
  }

  getComponent() {
    return Dashboard;
  }

  mapStateToProps(state, ownProps) {
    const {
      ageAtFirstObservation,
      cumulativeDuration,
      genderData,
      summary,
      characterizationDate,
    } = ownProps;
    let {
      observedByMonth,
    } = ownProps;

    if (observedByMonth) {
      observedByMonth = convertDataToMonthLineChartData(
        observedByMonth,
        observedByMonthDTO
      );
    }

    return {
      ageAtFirstObservation,
      cumulativeDuration,
      genderData: ReportUtils.prepareChartDataForDonut(genderData),
      observedByMonth,
      summary,
      characterizationDate,
      detailsCharts: this.detailsCharts,
    };
  }
}
