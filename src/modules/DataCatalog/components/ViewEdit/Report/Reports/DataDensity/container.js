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
 * Created: June 01, 2017
 *
 */

import { connect } from 'react-redux';
import get from 'lodash/get';
import { chart } from '@ohdsi/atlascharts/dist/atlascharts.umd';
import * as d3 from 'd3';
import moment from 'moment';
import DataDensity from './presenter';

function prepareLineData(rawData) {
  const data = { ...rawData };
  let normalizedData = {
    X_CALENDAR_MONTH: [],
  };
  let transformedData;
  if (rawData) {
    data.X_CALENDAR_MONTH.forEach((d, i, ar) => {
      ar[i] = moment(d, 'YYYYMM').valueOf(); // eslint-disable-line no-param-reassign
    });
    normalizedData = chart.dataframeToArray(data);
        // nest dataframe data into key->values pair
    transformedData = d3.nest()
            .key(d => d.SERIES_NAME)
            .entries(normalizedData)
            .map(d => ({ name: d.key, values: d.values }));
  }
  return {
    normalizedData,
    transformedData,
  };
}

function mapStateToProps(state) {
  const reportData = get(state, 'dataCatalog.report.data.result', {});
  const rawTotalRecords = get(reportData, 'TOTAL_RECORDS');
  const rawConceptsPerPerson = get(reportData, 'CONCEPTS_PER_PERSON');
  const rawRecordsPerPerson = get(reportData, 'RECORDS_PER_PERSON');

  const {
        transformedData: totalRecords,
        normalizedData: totalRecordsScale,
    } = prepareLineData(rawTotalRecords);

  const {
        transformedData: recordsPerPerson,
        normalizedData: perPersonScale,
    } = prepareLineData(rawRecordsPerPerson);

  let conceptsPerPerson;
  if (rawConceptsPerPerson) {
    conceptsPerPerson = chart.prepareData(rawConceptsPerPerson, chart.chartTypes.BOXPLOT);
  }

  return {
    conceptsPerPerson,
    recordsPerPerson,
    recordsPerPersonYears: perPersonScale,
    totalRecords,
    totalRecordsYears: totalRecordsScale,
  };
}

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(DataDensity);
