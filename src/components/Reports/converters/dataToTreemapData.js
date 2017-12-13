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
 * Authors: Pavel Grafkin
 * Created: November 14, 2017
 *
 */

import {
  treemap,
} from '@ohdsi/atlascharts/dist/atlascharts.umd';
import get from 'lodash/get';

export default (
  data,
  threshold = 10,
  DTO = {
    numPersons: 'NUM_PERSONS',
    id: 'CONCEPT_ID',
    path: 'CONCEPT_PATH',
    pctPersons: 'PERCENT_PERSONS',
    recordsPerPerson: 'RECORDS_PER_PERSON',
  }
) => {
  data.PERCENT_PERSONS = Array.isArray(data[DTO.pctPersons]) ? data[DTO.pctPersons].map(val => parseFloat(val)) : [];
  data.CONCEPT_PATH = data[DTO.path];

  return treemap.buildHierarchyFromJSON(data, threshold, (name, index, datum) => ({
    name,
    numPersons: get(datum, `${DTO.numPersons}[${index}]`),
    id: get(data, `${DTO.id}[${index}]`),
    path: get(data, `${DTO.path}[${index}]`),
    pctPerson: get(data, `${DTO.pctPersons}[${index}]`),
    recordsPerPerson: get(data, `${DTO.recordsPerPerson}[${index}]`),
  }));
};
