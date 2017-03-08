import * as React from 'react';
import {
  PageContent,
  LoadingPanel,
} from 'arachne-components';
import BEMHelper from 'services/BemHelper';
import Toolbar from './components/Toolbar';
import Facets from './components/Facets';
import Results from './components/Results';

require('./style.scss');

interface ISearchTermProps {
  isLoading: boolean;
};

function SearchTermsList(props: ISearchTermProps) {
  const { isLoading } = props;
  const classes = BEMHelper('search');

  return (    
    <div {...classes()}>
      <div className='row'>
        <div {...classes({ element: 'toolbar-wrapper', extra: 'col-xs-12 col-md-12' })}>
          <Toolbar />
        </div>
      </div>
      <div {...classes({ element: 'content', extra: 'row'})}>
        <div {...classes({ element: 'facets-wrapper', extra: 'col-xs-3 col-md-3' })}>
          <Facets />
        </div>
        <div {...classes({ element: 'results-wrapper', extra: 'col-xs-9 col-md-9' } )}>
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
};
