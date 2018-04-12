/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
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
