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
 * Created: June 13, 2017
 *
 */

import { createSelector } from 'reselect';
import get from 'lodash/get';
import { treemap } from '@ohdsi/atlascharts/dist/atlascharts.umd';

const getRawTableData = state => get(state, 'dataCatalog.report.data.result') || [];

const getTableData = createSelector(
  [getRawTableData],
  (data) => {
    const normalizedData = treemap.normalizeDataframe(data);
    if (!normalizedData.CONCEPT_PATH || !normalizedData.RECORDS_PER_PERSON) {
      return [];
    }
    const tableData = normalizedData.CONCEPT_PATH.map((row, i) => {
      const conceptDetails = row.split('||');

      return {
        id: {
          value: normalizedData.CONCEPT_ID[i],
        },
        atc1: {
          value: conceptDetails[0],
        },
        atc3: {
          value: conceptDetails[1],
        },
        atc5: {
          value: conceptDetails[2],
        },
        ingredient: {
          value: conceptDetails[3],
        },
        rxNorm: {
          value: conceptDetails[4],
        },
        personCount: {
          value: normalizedData.NUM_PERSONS[i],
          formatter: new treemap().formatters.format_comma,
        },
        prevalence: {
          value: normalizedData.PERCENT_PERSONS[i],
          formatter: new treemap().formatters.format_pct,
        },
        recordsPerPerson: {
          value: normalizedData.RECORDS_PER_PERSON[i],
        },
      };
    });

    return tableData;
  }
);

export default {
  getTableData,
};
