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
 * Created: November 13, 2017
 *
 */

import { ContainerBuilder } from 'services/Utils';
import {
  convertDataToLineChartData,
  convertDataToMonthLineChartData,
  convertDataToTrellislineData,
  convertDataToBoxplotData,
} from 'components/Reports/converters';
import {
  line,
  trellisline,
  boxplot,
} from '@ohdsi/atlascharts';
import { BaseChart } from 'components/Reports/BaseChart';
import {
  prevalenceByMonthDTO,
  personsInCohortFromCohortStartToEndDTO,
  personsByDurationFromStartToEndDTO,
  prevalenceByYearGenderSexDTO,
} from './DTO';
import presenter from './presenter';

class CohortspecificReport extends BaseChart {
  render() {
    return presenter(this.props);
  }
}

export default class CohortspecificReportBuilder extends ContainerBuilder {

  constructor() {
    super();
    this.detailsCharts = {
      prevalenceByMonthChart: new line(),
      prevalenceByYearGenderSexChart: new trellisline(),
      personsInCohortFromCohortStartToEndChart: new line(),
      personsByDurationFromStartToEndChart: new line(),
      ageAtIndexDistributionChart: new boxplot(),
      distributionOfAgeAtCohortStartByGenderChart: new boxplot(),
    }
  }

  getComponent() {
    return CohortspecificReport;
  }

  mapStateToProps(state, ownProps) {
    const {
      personsByDurationFromStartToEnd,
      ageAtIndexDistribution,
      distributionOfAgeAtCohortStartByCohortStartYear,
      distributionOfAgeAtCohortStartByGender,
      personsInCohortFromCohortStartToEnd,
      prevalenceByYearGenderSex: rawPrevalenceByYearGenderSex,
      prevalenceByMonth,
    } = ownProps;

    const {
      data: prevalenceByYearGenderSex,
      trellisSet: prevalenceByYearGenderSexSet,
    } = convertDataToTrellislineData(
      rawPrevalenceByYearGenderSex, prevalenceByYearGenderSexDTO
    );

    return {
      prevalenceByMonth:
        convertDataToMonthLineChartData(
          prevalenceByMonth, prevalenceByMonthDTO
        ),
      personsByDurationFromStartToEnd:
        convertDataToLineChartData(
          personsByDurationFromStartToEnd, personsByDurationFromStartToEndDTO
        ),
      ageAtIndexDistribution:
        convertDataToBoxplotData(ageAtIndexDistribution),
      distributionOfAgeAtCohortStartByCohortStartYear,
      distributionOfAgeAtCohortStartByGender:
        convertDataToBoxplotData(distributionOfAgeAtCohortStartByGender),
      personsInCohortFromCohortStartToEnd:
        convertDataToLineChartData(
          personsInCohortFromCohortStartToEnd, personsInCohortFromCohortStartToEndDTO
        ),
      prevalenceByYearGenderSex,
      prevalenceByYearGenderSexSet,
      detailsCharts: this.detailsCharts,
    };
  }
}
