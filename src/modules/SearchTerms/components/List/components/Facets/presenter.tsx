import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import { Action } from 'redux';
import { FormProps, DataShape, change as reduxFormChange } from 'redux-form';
import {
  FacetedSearchPanel,
  LoadingPanel,
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
  isLoading: boolean;
}

interface IFacetDispatchProps {
  search: (address: string) => typeof push;
  resetForm: () => Action;
  updateFacets: (params: searchParams) => (dispatch: Function) => any;
  changeFacets: (fieldName: string, value: Array<string>) => typeof reduxFormChange;
}

interface IFacets extends IFacetStateProps, IFacetDispatchProps {
  clearFilter: Function;
  doFilter: Function;
  doUpdateFacets: Function;
  removeFacetValue: (name: string, index: number) => any;
}

function Facets(props: IFacets) {
  const {
    facets,
    doFilter,
    clearFilter,
    isLoading,
    filterFormState,
    removeFacetValue,
  } = props;
  const classes = BEMHelper('search-facets');
  const submitBtn = {
    label: 'Search',
  };
  const selectedFacets = filterFormState.filter ? Object.keys(filterFormState.filter) : [];
  const tags = [];
  // count real length of the selected facet values
  selectedFacets.forEach((facet) => {
    filterFormState.filter[facet].forEach((value, index) => {
      tags.push(<div {...classes('selected-facet')}>
        <span {...classes('selected-facet-title')}>{value}</span>
        <span
          {...classes('remove-button')}
          onClick={() => removeFacetValue(facet, index)}
         >
          clear
        </span>
      </div>);
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
      <LoadingPanel active={isLoading} />
    </div>
  );
}

export default Facets;
export { IFacetStateProps, IFacetDispatchProps, IFacets };
