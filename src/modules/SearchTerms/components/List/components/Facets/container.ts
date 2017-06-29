import { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, reset, change as reduxFormChange } from 'redux-form';
import { forms, paths, resultsPageSize } from 'modules/SearchTerms/const';
import actions from 'modules/SearchTerms/actions';
import { push as goToPage } from 'react-router-redux';
import * as URI from 'urijs';
import { get, clone } from 'lodash';
import presenter from './presenter';
import selectors from './selectors';

import { IFacetStateProps, IFacetDispatchProps, IFacets } from './presenter';

class Facets extends Component<IFacets, void> {
  componentWillReceiveProps(props: IFacets) {
    if (
      ( // if form was cleared
        typeof this.props.filterFormState !== 'undefined' &&
        typeof props.filterFormState === 'undefined'
      ) ||
      // or updated
      this.props.filterFormState !== props.filterFormState
    ) {
      this.props.doUpdateFacets(props.filterFormState);
    }
  }

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
  const initialValues = selectors.getFilterInitialValues(state);
  const isLoading = get(state, 'searchTerms.facets.isLoading', false);

  return {
  	facets,
    initialValues,
    filterFormState: get(state, `form.${forms.filter}.values`, { filter: {} }),
    // to be used in filter
    pageSize,
    currentAddress,
    query,
    isLoading,
  };
}

const mapDispatchToProps = {
  search: (address: string) => goToPage(address),
  resetForm: () => reset(forms.filter),
  resetToolbar: () => reset(forms.toolbar),
  updateFacets: actions.facets.updateFacets,
  changeFacets: (fieldName: string, value: Array<string>) => reduxFormChange(forms.filter, fieldName, value),
};

function mergeProps(stateProps: IFacetStateProps, dispatchProps: IFacetDispatchProps, ownProps: Object): IFacets
{
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    doFilter: (data: { filter: { [key: number]: string; } }) => {
      if (!data.filter) {
        return;
      }
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
      const currentAddress = new URI(stateProps.currentAddress.pathname);
      currentAddress.addSearch('pageSize', stateProps.pageSize);
      currentAddress.addSearch('page', 1);
      if (stateProps.query) {
        currentAddress.addSearch('query', stateProps.query);
      }

      dispatchProps.search(currentAddress.href());
      dispatchProps.resetForm();
    },
    doUpdateFacets: (newFilterState: { filter: { [key: number]: string; } }) => {      
      const requestParams = {
        ...newFilterState.filter,
        page: 1,
        pageSize: 1,
        query: stateProps.query,
      };
      dispatchProps.updateFacets(requestParams);
    },
    removeFacetValue: (facet: string, index: number) => {
      const facets = clone(stateProps.filterFormState.filter[facet]);
      facets.splice(index, 1);
      dispatchProps.changeFacets(`filter[${facet}]`, facets);
    },
    resetQuery: () => {
      const currentAddress = stateProps.currentAddress;
      const uri = new URI(currentAddress.pathname+currentAddress.search);
      uri.setSearch('query','');
      dispatchProps.search(uri.href());
      dispatchProps.resetToolbar();
    },
  };

}

const FormFacets = reduxForm({
  form: forms.filter,
})(Facets);

export default connect<IFacetStateProps, IFacetDispatchProps, {}>
(mapStateToProps, mapDispatchToProps, mergeProps)
(FormFacets);
