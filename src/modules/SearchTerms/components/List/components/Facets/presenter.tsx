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
  options?: FacetOption[],
}

interface IFacetProps {
  facets: IFacet[];
}

interface IFacets extends FormProps<{}, {}, {}> {
  facets: IFacet[];
}

function Facets(props: IFacets) {
  const {
    facets,
  } = props;
  const classes = BEMHelper('search-facets');

  return (
    <div {...classes()}>
      <FacetedSearchPanel
        dynamicFields={facets}
        showRefineSearch={false}
        fullTextSearchEnabled={false}
        sortingEnabled={false}
        doSubmit={() => {}}
        {...props}
      />
    </div>
  );
}

export default Facets;
export { IFacetProps, IFacets };
