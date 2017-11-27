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
 * Created: August 17, 2017
 *
 */

const mimeTypes = {
  image: 'image',
  txt: 'txt',
  pdf: 'pdf',
  sql: 'sql',
  zip: 'zip',
  rar: 'rar',
  gz: 'gz',
  packrat: 'packrat',
  json: 'json',
  csv: 'csv',
  r: 'r',
  cohort: 'cohort',
  excel: 'excel',
  estimation: 'estimation',
  comparator: 'comparator cohort',
  outcomeCohort: 'outcome cohort',
  targetCohort: 'target cohort',
  html: 'html',
  other: 'other',
  text: 'text',
  link: 'link',
  report: 'report',
  folder: 'folder',
};

export default mimeTypes;
