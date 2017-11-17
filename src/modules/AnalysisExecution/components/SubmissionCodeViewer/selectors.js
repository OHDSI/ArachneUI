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
 * Created: November 14, 2017
 *
 */


import { TreemapSelectorsBuilder } from 'services/Utils';
import { convertDataToTableData } from 'components/Reports/converters';
import { reports } from 'const/reports';
import { treemap } from '@ohdsi/atlascharts/dist/atlascharts.umd';

export default class SelectorsBuilder extends TreemapSelectorsBuilder {
  constructor() {
    super();
    this.rowMappers = {
      [reports.PROCEDURES]: this.mapRowForProcedures,
      [reports.VISITS]: this.mapRowForVisits,
      [reports.CONDITIONS]: this.mapRowForConditions,
      [reports.CONDITIONERA]: this.mapRowForConditionEras,
      [reports.DRUGERA]: this.mapRowForDrugEras,
    };
  }

  mapRowForProcedures(concept, normalData, i) {
    return {
      id: {
        columnName: 'Concept Id',
        value: normalData.CONCEPT_ID[i],
      },
      level4: {
        columnName: 'Level 4',
        value: concept[0],
      },
      level3: {
        columnName: 'Level 3',
        value: concept[1],
      },
      level2: {
        columnName: 'Level 2',
        value: concept[2],
      },
      procedure: {
        columnName: 'Procedure',
        value: concept[3],
      },
      personCount: {
        columnName: 'Person Count',
        value: normalData.NUM_PERSONS[i],
      },
      prevalence: {
        columnName: 'Prevalence',
        value: normalData.PERCENT_PERSONS[i],
      },
      recordsPerPerson: {
        columnName: 'Records per person',
        value: normalData.RECORDS_PER_PERSON[i],
      },
    };
  }

  mapRowForVisits(concept, normalData, i) {
    return {
      id: {
        columnName: 'Concept Id',
        value: normalData.CONCEPT_ID[i],
      },
      type: {
        columnName: 'Visit type',
        value: concept[0],
      },
      personCount: {
        columnName: 'Person Count',
        value: normalData.NUM_PERSONS[i],
      },
      prelevance: {
        columnName: 'Prelevance',
        value: normalData.PERCENT_PERSONS[i],
      },
      recordsPerPerson: {
        columnName: 'Records per person',
        value: normalData.RECORDS_PER_PERSON[i],
      },
    };
  }

  mapRowForConditions(concept, normalData, i) {
    return {
      id: {
        columnName: 'Concept Id',
        value: normalData.CONCEPT_ID[i],
      },
      soc: {
        columnName: 'SOC',
        value: concept[0],
      },
      hlgt: {
        columnName: 'HTGL',
        value: concept[1],
      },
      hlt: {
        columnName: 'HTL',
        value: concept[2],
      },
      pt: {
        columnName: 'PT',
        value: concept[3],
      },
      conceptName: {
        columnName: 'Concept name',
        value: concept[4],
      },
      prelevance: {
        columnName: 'Prelevance',
        value: normalData.PERCENT_PERSONS[i],
      },
      recordsPerPerson: {
        columnName: 'Records per person',
        value: normalData.RECORDS_PER_PERSON[i],
      },
    };
  }

  mapRowForConditionEras(concept, normalData, i) {
    return {
      id: {
        columnName: 'Id',
        value: normalData.CONCEPT_ID[i],
      },
      soc: {
        columnName: 'SOC',
        value: concept[0],
      },
      hlgt: {
        columnName: 'HLGT',
        value: concept[1],
      },
      hlt: {
        columnName: 'HLT',
        value: concept[2],
      },
      pt: {
        columnName: 'PT',
        value: concept[3],
      },
      snomed: {
        columnName: 'SNOMED',
        value: concept[4],
      },
      personCount: {
        columnName: 'Person count',
        value: normalData.NUM_PERSONS[i],
        formatter: new treemap().formatters.format_comma,
      },
      prevalence: {
        columnName: 'Prevalence',
        value: normalData.PERCENT_PERSONS[i],
        formatter: new treemap().formatters.format_pct,
      },
      lengthOfEra: {
        columnName: 'Length of era',
        value: normalData.LENGTH_OF_ERA[i],
      },
    };
  }

  mapRowForDrugEras(concept, normalData, i) {
    return {
      id: {
        columnName: 'Id',
        value: normalData.CONCEPT_ID[i],
      },
      atc1: {
        columnName: 'ATC1',
        value: concept[0],
      },
      atc3: {
        columnName: 'ATC3',
        value: concept[1],
      },
      atc5: {
        columnName: 'ATC5',
        value: concept[2],
      },
      ingredient: {
        columnName: 'Ingredient',
        value: concept[3],
      },
      personCount: {
        columnName: 'Person count',
        value: normalData.NUM_PERSONS[i],
        formatter: new treemap().formatters.format_comma,
      },
      prevalence: {
        columnName: 'Prevalence',
        value: normalData.PERCENT_PERSONS[i],
        formatter: new treemap().formatters.format_pct,
      },
      lengthOfEra: {
        columnName: 'Length of era',
        value: normalData.LENGTH_OF_ERA[i],
      },
    };
  }

  extractTableData(reportType, data) {
    return convertDataToTableData(
      data,
      this.rowMappers[reportType]
    );
  }

  build() {
    return {
      getTableData: this.extractTableData.bind(this),
    };
  }
}
