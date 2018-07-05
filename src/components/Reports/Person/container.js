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

import ReportUtils from 'components/Reports/Utils';
import { ContainerBuilder } from 'services/Utils';
import {
  donut,
  histogram,
} from '@ohdsi/atlascharts/dist/atlascharts.umd';
import { BaseChart } from 'components/Reports/BaseChart';
import presenter from './presenter';

class Person extends BaseChart {
  render() {
    return presenter(this.props);
  }
}

export default class PersonContainerBuilder extends ContainerBuilder {

  constructor() {
    super();
    this.detailsCharts = {
      birthYearChart: new histogram(),
      genderDataChart: new donut(),
      raceChart: new donut(),
      ethnicityChart: new donut(),
    }
  }

  getComponent() {
    return Person;
  }

  mapStateToProps(state, ownProps) {
    const {
      birthYear,
      ethnicity,
      genderData,
      race,
      summary,
    } = ownProps;

    return {
      birthYear,
      ethnicity: ReportUtils.prepareChartDataForDonut(ethnicity),
      genderData: ReportUtils.prepareChartDataForDonut(genderData),
      race: ReportUtils.prepareChartDataForDonut(race),
      summary,
      detailsCharts: this.detailsCharts,
    };
  }
}
