import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import { FormProps } from 'redux-form';
import {
  FacetedSearchPanel,
} from 'arachne-components';

require('./style.scss');

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

interface IFacetProps {
  facets: IFacet[];
  filterFormState: { [key: string]: string | Array<string> } | {};
  initialValues: { [key: string]: string | Array<string> };
  pageSize: number;
  currentAddress: Object;
  query: string;
}

interface IFacetDispatchProps {
  search: Function;
  updateFacets: Function;
}

interface IFacets extends FormProps<{}, {}, {}>, IFacetProps, IFacetDispatchProps {
  clearFilter: Function;
  filter: Function;
}

function Facets(props: IFacets) {
  const {
    facets,
    filter,
    clearFilter,
  } = props;
  const classes = BEMHelper('search-facets');

  return (
    <div {...classes()}>
      <FacetedSearchPanel
        dynamicFields={facets}
        showRefineSearch={false}
        fullTextSearchEnabled={false}
        sortingEnabled={false}
        doSubmit={filter}
        doClear={clearFilter}
        {...props}
      />
    </div>
  );
}

export default Facets;
export { IFacetProps, IFacetDispatchProps, IFacets };
