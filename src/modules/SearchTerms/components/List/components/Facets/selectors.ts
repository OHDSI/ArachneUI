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
import * as URI from 'urijs';
import types from 'const/metadataTypes';
import { facetKeys, forms } from 'modules/SearchTerms/const';
import { FacetTitles } from '../FacetTitles';
import { initialFormState } from './presenter';

type map = {
  [key: string]: any;
};

function getFacetTitle(facetId: string): string {
  return FacetTitles[getFacetKey(facetId)];
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

const getRawFacets = (state: Object) => get(state, 'searchTerms.terms.queryResult.facets') || [];
const getRawInitialValues = (state: Object) => get(state, 'routing.locationBeforeTransitions.query') || {};
const getRawValues = (state: Object) => get(state, `form.${forms.filter}.values.filter`, { });

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

function makeFilterFormValues(rawValues: map): initialFormState {
  let filter: map = {};
  // filter out pageSize etc
  const facets = Object.keys(rawValues).filter(facetName => facetName in facetKeys);
  facets.map((facetKey: string) => {
    filter[`${facetKey}`] = Array.isArray(rawValues[facetKey]) ? rawValues[facetKey] : [rawValues[facetKey]];
  });

  return {
    filter
  };
};

const getFilterInitialValues = createSelector(
  getRawInitialValues,
  makeFilterFormValues
  );

const getFilterValues = createSelector(
  getRawValues,
  makeFilterFormValues
);

export default {
  getFacets,
  getFilterInitialValues,
  getFilterValues,
};
