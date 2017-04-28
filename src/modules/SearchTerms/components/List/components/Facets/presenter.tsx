import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import { Action } from 'redux';
import { FormProps, DataShape } from 'redux-form';
import {
  FacetedSearchPanel,
} from 'arachne-components';
import { locationDescriptor } from 'modules/SearchTerms/components/List/presenter';
import { push } from 'react-router-redux';
import { searchParams } from 'modules/SearchTerms/actions/termList';

require('./style.scss');

type initialValues = { [key: string]: string | Array<string> };

interface initialFormState {
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
}

interface IFacetDispatchProps {
  search: (address: string) => typeof push;
  resetForm: () => Action;
  updateFacets: (params: searchParams) => (dispatch: Function) => any;
}

interface IFacets extends IFacetStateProps, IFacetDispatchProps {
  clearFilter: Function;
  doFilter: Function;
  doUpdateFacets: Function;
}

function Facets(props: IFacets) {
  const {
    facets,
    doFilter,
    clearFilter,
  } = props;
  const classes = BEMHelper('search-facets');
  const submitBtn = {
    label: 'Search',
  };

  return (
    <div {...classes()}>
      <FacetedSearchPanel
        dynamicFields={facets}
        showRefineSearch={false}
        fullTextSearchEnabled={false}
        sortingEnabled={false}
        doSubmit={doFilter}
        doClear={clearFilter}
        submitBtnConfig={submitBtn}
        emptyOptionsDisabled={false}
        {...props}
      />
    </div>
  );
}

export default Facets;
export { IFacetStateProps, IFacetDispatchProps, IFacets };
