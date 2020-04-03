/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexandr Saltykov, Pavel Grafkin, Vitaly Koulakov, Anton Gackovka
 * Created: March 3, 2017
 *  
 */

import { createSelector } from 'reselect';
import { get } from 'lodash';
import { resultsPageSize, paths } from 'modules/SearchTerms/const';
import { Term } from './presenter';

function getConceptFieldId(fieldName: string): string {
  let id = fieldName;
  switch(fieldName.toLowerCase()) {
    case 'classname': id = 'concept_class_id'; break;
    case 'name': id = 'concept_name'; break;
    case 'code': id = 'concept_code'; break;
    case 'standardconcept': id = 'standard_concept'; break;
    case 'invalidreason': id = 'invalid_reason'; break;
    case 'domain': id = 'domain_id'; break;
    case 'vocabulary': id = 'vocabulary_id'; break;
    case 'id': id = 'concept_id'; break;
  }

  return id;
}
function getConceptFieldName(fieldId: string): string {
  let name = '';
  switch(fieldId.toLowerCase()) {
    case 'concept_class_id': name = 'className'; break;
    case 'concept_name': name = 'name'; break;
    case 'concept_code': name = 'code'; break;
    case 'standard_concept': name = 'standardConcept'; break;
    case 'invalid_reason': name = 'invalidReason'; break;
    case 'domain_id': name = 'domain'; break;
    case 'vocabulary_id': name = 'vocabulary'; break;
    case 'concept_id': name = 'id'; break;
  }

  return name;
}

const getRawResults = (state: Object) => get(state, 'searchTerms.terms.queryResult.content', []);

const getResults = createSelector(
    getRawResults,
    rawResults => rawResults.map((term: Term) => ({
      ...term,
      link: paths.term(term.id),
    })),
  );

export default {
  getResults,
  getConceptFieldId,
  getConceptFieldName,
};
