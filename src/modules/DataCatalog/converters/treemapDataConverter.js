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
 * Created: September 06, 2017
 *
 */

export default data => {
  // data.NUM_PERSONS = Array.isArray(data.NUM_PERSONS) ? data.NUM_PERSONS.map(val => parseInt(val, 10)) : [];
  data.PERCENT_PERSONS = Array.isArray(data.PERCENT_PERSONS) ? data.PERCENT_PERSONS.map(val => parseFloat(val)) : [];
  // data.RECORDS_PER_PERSON = Array.isArray(data.RECORDS_PER_PERSON) ? data.RECORDS_PER_PERSON.map(val => parseFloat(val)) : [];
  return data;
}