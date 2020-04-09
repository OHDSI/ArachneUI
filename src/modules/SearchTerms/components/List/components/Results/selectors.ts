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

import {createSelector} from 'reselect';
import {get} from 'lodash';
import {paths} from 'modules/SearchTerms/const';
import {Term} from './presenter';

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
  }

  return name;
}

const getRawResults = function (state: Object) {
  return get(state, 'searchTerms.terms.queryResult.content', []);
};

const getResults = createSelector(
    getRawResults,
    function (rawResults) {
      return rawResults.map((term: Term) => ({
        ...term,
        link: paths.term(term.id),
      }));
    },
  );

const getDebugResults = createSelector(
    function (state: Object){
      return get(state, 'searchTerms.terms.queryResult.debug', "");
    },
    function (debug) {
      console.log(debug);
      return debug;
    },
);

const getQueryResults = createSelector(
    function (state: Object){
      return get(state, 'searchTerms.terms.queryResult.query', "");
    },
    function (query) {
      console.log(query);
      return query;
    },
);

const isDebug = function (state: Object) {
    let query =  get(state, 'routing.locationBeforeTransitions', {
        query: {
            query: '',
            debug: 'false'
        },
    });
    return query.query.debug;
};

export default {
  getResults,
  getConceptFieldId,
  getConceptFieldName,
  getDebugResults,
  getQueryResults,
  isDebug,
};
