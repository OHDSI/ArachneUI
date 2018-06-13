/*
 *
 * Copyright 2018 Observational Health Data Sciences and Informatics
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: january 23, 2018
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import EmptyState from 'components/EmptyState';
import { LoadingPanel } from 'arachne-ui-components';
import ResultItem from './ResultItem';

import './style.scss';

export default function SearchResultsList(props) {
  const classes = BEMHelper('search-result-list');
  const {
    results,
    isLoading,
  } = props;

  return (
    <div {...classes({ modifiers: { empty: results.length === 0 } })}>
      <div {...classes('list')}>
        {results && results.length
          ? results.map(result => <ResultItem {...result} />)
          : <EmptyState message={'No results'} />
        }
      </div>
      <LoadingPanel active={isLoading} />
    </div>
  );
}
