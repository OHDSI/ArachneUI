import { createSelector } from 'reselect';
import { get } from 'lodash';
import * as URI from 'urijs';
import types from 'const/metadataTypes';
import { facetKeys } from 'modules/SearchTerms/const';

type map = {
  [key: string]: any;
};

function getFacetTitle(facetId: string): string {
  let title = facetId;
  switch(facetId.toLowerCase()) {
    case 'domain_id': title = 'Domain'; break;
    case 'standard_concept': title = 'Standard concept'; break;
    case 'concept_class_id': title = 'Class'; break;
    case 'vocabulary_id': title = 'Vocabulary'; break;
    case 'invalid_reason': title = 'Invalid reason'; break;
  }

  return title;
}

function getFacetKey(facetId: string): string {
  let key = facetId;
  switch(facetId.toLowerCase()) {
    case 'domain_id': key = facetKeys.domain; break;
    case 'standard_concept': key = facetKeys.standardConcept; break;
    case 'concept_class_id': key = facetKeys.conceptClass; break;
    case 'vocabulary_id': key = facetKeys.vocabulary; break;
    case 'invalid_reason': key = facetKeys.invalidReason; break;
  }

  return key;
}

const getRawFacets = (state: Object) => get(state, 'searchTerms.facets.queryResult.facets') || [];
const getRawInitialValues = (state: Object) => get(state, 'routing.locationBeforeTransitions.query') || {};

const getFacets = createSelector(
  getRawFacets,
  (rawFacets: map) => Object.keys(rawFacets).map(facet => ({
    faceted: true,
    label: getFacetTitle(facet),
    name: getFacetKey(facet),
    type: types.enum,
    options: Object.keys(rawFacets[facet]).map(option => ({
      facetCount: rawFacets[facet][option],
      label: `${option} (${rawFacets[facet][option]})`,
      value: option,
    })),
  })),
);

const getFilterInitialValues = createSelector(
  getRawInitialValues,
  (rawValues: map) => {
      let filter: map = {};
      // filter out pageSize etc
      const facets = Object.keys(rawValues).filter(facetName => facetName in facetKeys);
      facets.map((facetKey: string) => {
        filter[`${facetKey}`] = Array.isArray(rawValues[facetKey]) ? rawValues[facetKey] : [rawValues[facetKey]];
      });

      return {
        filter
      };
    }
  );

export default {
  getFacets,
  getFilterInitialValues,
};
