import * as React from 'react';
import {
  PageContent,
  LoadingPanel,
} from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import Toolbar from './components/Toolbar';
import Facets from './components/Facets';
import Results from './components/Results';

require('./style.scss');

interface ISearchTermProps {
  searchStr: string;
  isLoading: boolean;
};

type locationDescriptor = {
  pathname: string;
  search: string;
  query?: { [key: string]: string | number | Array<string> };
};

function SearchTermsList(props: ISearchTermProps) {
  const { isLoading } = props;
  const classes = BEMHelper('search');

  return (    
    <div {...classes()}>
      <Toolbar />
      <div {...classes({ element: 'content'})}>
        <div {...classes({ element: 'facets-wrapper' })}>
          <Facets />
        </div>
        <div {...classes({ element: 'results-wrapper' } )}>
          <Results />
        </div>
      </div>
      <LoadingPanel active={isLoading} />
    </div>
  );
}

export default SearchTermsList;
export {
  ISearchTermProps,
  locationDescriptor,
};
