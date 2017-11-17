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
 * Authors: Alexander Saltykov
 * Created: November 15, 2017
 *
 */

import { reports } from 'const/reports';

const DTO = {
  [reports.CONDITIONS]: {
    ageAtFirstDiagnosis: 'ageOfFirstDiagnosis',
    sqlConditionsByType: 'conditionByType',
    prevalenceByGenderAgeYear: 'conditionPrevalence',
    prevalenceByMonth: 'conditionByMonth',
  },
  [reports.VISITS]: {
    ageAtFirstOccurrence: 'ageAtFirstOccurrence',
    visitDurationByType: 'durationByType',
    prevalenceByGenderAgeYear: 'conditionPrevalence',
    prevalenceByMonth: 'conditionByMonth',
  },
  [reports.OBSERVATIONS]: {
    ageAtFirstOccurrence: 'ageAtFirstOccurrence',
    observationsByType: 'observationsByType',
    prevalenceByGenderAgeYear: 'conditionPrevalence',
    prevalenceByMonth: 'conditionByMonth',
  },
  [reports.PROCEDURES]: {
    ageAtFirstOccurrence: 'ageOfFirstOccurrence',
    proceduresByType: 'proceduresByType',
    prevalenceByGenderAgeYear: 'conditionPrevalence',
    prevalenceByMonth: 'conditionByMonth',
  },
  [reports.CONDITIONERA]: {
    ageAtFirstDiagnosis: 'ageOfFirstDiagnosis',
    lengthOfEra: 'lengthOfEra',
    prevalenceByGenderAgeYear: 'conditionPrevalence',
    prevalenceByMonth: 'conditionByMonth',
  },
  [reports.DRUGERA]: {
    prevalenceByGenderAgeYear: 'conditionPrevalence',
    ageAtFirstExposure: 'ageOfFirstExposure',
    lengthOfEra: 'lengthOfEra',
    prevalenceByMonth: 'exposureByMonth',
  },
};

export default DTO;
