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
import { treemap } from '@ohdsi/atlascharts/dist/atlascharts.umd';
import get from 'lodash/get';

export default class SelectorsBuilder extends TreemapSelectorsBuilder {
  constructor() {
    super();
    this.dataPath = 'dataCatalog.report.data.result';
    this.detailsPath = 'dataCatalog.reportDetails.data.result';
  }

  extractTableData(data) {
    const normalizedData = treemap.normalizeDataframe(data);
    if (!normalizedData.CONCEPT_PATH || !normalizedData.LENGTH_OF_ERA) {
      return [];
    }
    const tableData = normalizedData.CONCEPT_PATH.map((row, i) => {
      const conceptDetails = row.split('||');

      return {
        id: {
          value: normalizedData.CONCEPT_ID[i],
        },
        soc: {
          value: conceptDetails[0],
        },
        hlgt: {
          value: conceptDetails[1],
        },
        hlt: {
          value: conceptDetails[2],
        },
        pt: {
          value: conceptDetails[3],
        },
        snomed: {
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
        lengthOfEra: {
          value: normalizedData.LENGTH_OF_ERA[i],
        },
      };
    });

    return tableData;
  }

  extractReportDetails(details) {
    return {
      ageOfFirstDiagnosis: get(details, 'AGE_AT_FIRST_DIAGNOSIS'),
      lengthOfEra: get(details, 'LENGTH_OF_ERA'),
      conditionByMonth: get(details, 'PREVALENCE_BY_MONTH'),
      conditionPrevalence: get(details, 'PREVALENCE_BY_GENDER_AGE_YEAR'),
    };
  }

}
