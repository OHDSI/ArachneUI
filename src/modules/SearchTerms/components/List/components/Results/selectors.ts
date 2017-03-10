import { createSelector } from 'reselect';
import { get } from 'lodash';
import { resultsPageSize, paths } from 'modules/SearchTerms/const';

function getConceptFieldId(fieldName: string): string {
  let id = '';
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

const getRawResults = (state: Object) => get(state, 'searchTerms.terms.queryResult.content') || [];

const getResults = createSelector(
    getRawResults,
    rawResults => rawResults.map(term => ({
      ...term,
      link: paths.term(term.id),
    })),
  );

export default {
  getResults,
  getConceptFieldId,
  getConceptFieldName,
};
