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
 * Created: June 13, 2017
 *
 */

import { TreemapSelectorsBuilder } from 'services/Utils';
import { treemap } from '@ohdsi/atlascharts';
import { get } from 'services/Utils';
import * as d3 from 'd3';

export default class SelectorsBuilder extends TreemapSelectorsBuilder {
  constructor() {
    super();
    this.dataPath = 'dataCatalog.report.data.result';
    this.detailsPath = 'dataCatalog.reportDetails.data.result';
  }

  extractTableData(data) {
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
        visitName: {
          value: conceptDetails[0],
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
          formatter: new treemap().formatters.format_fixed,
        },
      };
    });

    return tableData;
  }

  extractReportDetails(details) {
    return {
      ageAtFirstOccurrence: get(details, 'AGE_AT_FIRST_OCCURRENCE', []),
      durationByType: get(details, 'VISIT_DURATION_BY_TYPE', []),
      conditionPrevalence: get(details, 'PREVALENCE_BY_GENDER_AGE_YEAR', []),
      conditionByMonth: get(details, 'PREVALENCE_BY_MONTH', []),
    };
  }
}
