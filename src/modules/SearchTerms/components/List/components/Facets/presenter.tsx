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

import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import { Action } from 'redux';
import { FormProps, DataShape, change as reduxFormChange } from 'redux-form';
import {
  FacetedSearchPanel,
} from 'arachne-ui-components';
import { locationDescriptor } from 'modules/SearchTerms/components/List/presenter';
import { push } from 'react-router-redux';
import { searchParams } from 'modules/SearchTerms/actions/termList';

require('./style.scss');

type initialValues = { [key: string]: string | Array<string> };

export interface initialFormState {
  filter: initialValues | {};
};

type FacetOption = {
  facetCount: number;
  label: string;
  value: string;
}

type IFacet = {
  faceted: boolean;
  label: string;
  name: string;
  type: string;
  max?: number;
  min?: number;
  options?: FacetOption[];
}

interface IFacetStateProps {
  facets: IFacet[];
  filterFormState: initialFormState;
  initialValues?: DataShape;
  pageSize: number;
  currentAddress: locationDescriptor;
  query: string;
  submittedQuery: string;
}

interface IFacetDispatchProps {
  search: (address: string) => typeof push;
  cleanForm: () => Action;
  changeFacets: (fieldName: string, value: Array<string>) => typeof reduxFormChange;
}

interface IFacets extends IFacetStateProps, IFacetDispatchProps {
  clearFilter: Function;
  doFilter: Function;
  removeFacetValue: (name: string, index: number) => any;
  resetQuery: () => void;
}

function generateElement(className: string, type: string, text: string, onClick: () => void) {
  const classes = BEMHelper('facet-tag');
  return (
      <div {...classes({ modifiers: type, extra: className })}>
        <span {...classes(`title`)}>{text}</span>
        <span
            {...classes(`remove-button`)}
            onClick={onClick}
        >
              clear
          </span>
      </div>);
}

function Facets(props: IFacets) {
  const {
    facets,
    doFilter,
    clearFilter,
    filterFormState,
    removeFacetValue,
    query,
    submittedQuery,
    resetQuery,
  } = props;
  const classes = BEMHelper('search-facet-panel');
  const submitBtn = {
    label: 'Search',
  };
  const selectedFacets = filterFormState.filter ? Object.keys(filterFormState.filter) : [];

  const tags = [];

  if (!!submittedQuery) {
    tags.push(generateElement(classes('selected-facet').className, 'purple', submittedQuery, resetQuery));
  }
  // count real length of the selected facet values

  selectedFacets.forEach((facet) => {
    filterFormState.filter[facet].forEach((value, index) => {
      tags.push(generateElement(classes('selected-facet').className, facet, value, () : void => {removeFacetValue(facet, index)}));
    })
  });

  return (
    <div {...classes()}>
      {tags.length
        ? <div {...classes('current-state')}>
            {tags}
          </div>
        : null
      }
      <FacetedSearchPanel
        dynamicFields={facets}
        showRefineSearch={false}
        fullTextSearchEnabled={false}
        sortingEnabled={false}
        doSubmit={doFilter}
        doClear={clearFilter}
        submitBtnConfig={submitBtn}
        emptyOptionsDisabled={true}
        isAccordion={true}
        {...props}
      />
    </div>
  );
}

export default Facets;
export { IFacetStateProps, IFacetDispatchProps, IFacets };
