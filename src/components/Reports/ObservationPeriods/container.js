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
import {
  convertDataToBoxplotData,
  convertDataToTrellislineData,
  convertDataToMonthLineChartData,
} from 'components/Reports/converters';
import ObservationPeriods from './presenter';
import {
	donut,
	histogram,
	boxplot,
	line,
} from '@ohdsi/atlascharts/dist/atlascharts.umd';
import { ContainerBuilder } from 'services/Utils';

const observationsByMonthDTO = {
  dateField: 'MONTH_YEAR',
  yValue: 'COUNT_VALUE',
  yPercent: 'PERCENT_VALUE',
};

export default class ObservationPeriodContainerBuilder extends ContainerBuilder {

  constructor() {
    super();
		this.detailsCharts = {
			ageAtFirstObservationChart: new histogram(),
			ageByGenderChart: new boxplot(),
			observationLengthChart: new histogram(),
			durationByGenderChart: new boxplot(),
			cumulativeObservationChart: new line(),
			durationByAgeDeclineChart: new boxplot(),
			durationByYearChart: new histogram(),
			observationsPerPersonChart: new donut(),
			observationsByMonthChart: new line(),
		}
  }

  getComponent() {
    return ObservationPeriods;
  }

	mapStateToProps(state, ownProps) {
		const {
			ageByGender,
			durationByGender,
			durationByAgeDecline,
			ageAtFirstObservation,
			observationLength,
			rawCumulativeObservation,
			durationByYear,
			observationsPerPerson,
			observationsByMonth,
		} = ownProps;
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

		return {
			ageByGender:
				convertDataToBoxplotData(
					ageByGender
				),
			durationByGender:
				convertDataToBoxplotData(
					durationByGender
				),
			durationByAgeDecline:
				convertDataToBoxplotData(
					durationByAgeDecline
				),
			ageAtFirstObservation,
			observationLength,
			cumulativeObservation,
			durationByYear,
			observationsPerPerson: observationsPerPerson
				? ReportUtils.prepareChartDataForDonut(observationsPerPerson)
				: null,
			observationsByMonth:
				convertDataToMonthLineChartData(
					observationsByMonth,
					observationsByMonthDTO
				),
			...this.detailsCharts,
		};
	}
}