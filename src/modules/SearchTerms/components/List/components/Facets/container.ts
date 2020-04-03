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

import { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, change as reduxFormChange, initialize } from 'redux-form';
import { forms, paths, resultsPageSize } from 'modules/SearchTerms/const';
import {push as goToPage} from 'react-router-redux';
import * as URI from 'urijs';
import { get, clone } from 'lodash';
import presenter from './presenter';
import selectors from './selectors';

import {IFacetStateProps, IFacetDispatchProps, IFacets} from './presenter';

class Facets extends Component<IFacets, {}> {

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: Object): IFacetStateProps {
	const facets = selectors.getFacets(state);
  const currentAddress = get(state, 'routing.locationBeforeTransitions', {
    pathname: '',
    search: '',
  });
  const pageSize = get(state, 'searchTerms.termList.data.pageSize', resultsPageSize);
  const query = get(state, 'form.toolbar.values.searchString', '');
  const submittedQuery = get(currentAddress, 'query.query', '');
  const initialValues = selectors.getFilterInitialValues(state);
  const filterFormState = selectors.getFilterValues(state);

  return {
  	facets,
    initialValues,
    filterFormState,
    // to be used in filter
    pageSize,
    currentAddress,
    query,
    submittedQuery,
  };
}

const mapDispatchToProps = {
  search: (address: string) => goToPage(address),
  cleanForm: () => initialize(forms.filter, {}, false),
  changeFacets: (fieldName: string, value: Array<string>) => reduxFormChange(forms.filter, fieldName, value),
};

function mergeProps(stateProps: IFacetStateProps, dispatchProps: IFacetDispatchProps, ownProps: Object): IFacets
{
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    doFilter: (data: { filter: { [key: number]: string; } }) => {
      const currentAddress = stateProps.currentAddress;
      const query = new URI(`${currentAddress.pathname}`);
      query.addSearch({
        ...data.filter,
        page: 1,
        pageSize: stateProps.pageSize,
        query: stateProps.query,
      });

      dispatchProps.search(query.href());
    },
    clearFilter: () => {
      dispatchProps.cleanForm();
    },
    removeFacetValue: (facet: string, index: number) => {
      const facets = clone(stateProps.filterFormState.filter[facet]);
      facets.splice(index, 1);
      dispatchProps.changeFacets(`filter[${facet}]`, facets);
    },
    resetQuery: () : void => {
      const currentAddress = stateProps.currentAddress;
      const uri = new URI(currentAddress.pathname+currentAddress.search);
      uri.setSearch('query', '');
      dispatchProps.search(uri.href());
    },
  };

}

function formChangesHandler(formData, dispatch?, props?: IFacets) {
    props.doFilter(formData);
}

const FormFacets = reduxForm({
    form: forms.filter,
    onChange: formChangesHandler,
})(Facets);

export default connect<IFacetStateProps, IFacetDispatchProps, any>
(mapStateToProps, mapDispatchToProps, mergeProps)
(FormFacets);
