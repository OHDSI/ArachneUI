/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
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
import pluralize from 'pluralize';
import {
  Button,
  Link,
  ListItem,
  Pagination,
} from 'arachne-ui-components';
import EmptyState from 'components/EmptyState';

import './style.scss';

function SearchSection(props) {
  const {
    title = 'Section',
    resultsCount = 0,
    isActive,
    onClick,
  } = props;
  const classes = BEMHelper('search-result-filter-item');
  const mods = ['rounded'];
  if (isActive) {
    mods.push('success');
  } else {
    mods.push('cancel');
  }

  return (
    <Button
      {...classes()}
      onClick={onClick}
      mods={mods}
    >
      {title} ({resultsCount} {pluralize('Result', resultsCount)})
      <div {...classes({ element: 'tick', modifiers: { active: isActive } })}>add</div>
    </Button>
  );
}

function ResultItem(props) {
  const {
    title,
    description,
    path,
  } = props;
  const classes = BEMHelper('search-result-list-item');

  return (
    <ListItem>
      <div {...classes()}>
        <Link to={path}>{title}</Link>
        <span {...classes('desc')}>{description}</span>
      </div>
    </ListItem>
  );
}

function Result(props) {
  const {
    title,
    results,
  } = props;
  const classes = BEMHelper('search-result-list-section');

  return (
    <div {...classes()}>
      <div {...classes('title')}>{title}</div>
      {results.map(result => <ResultItem {...result} />)}
    </div>
  );
}

export default function SearchResultsList(props) {
  const classes = BEMHelper('search-result-list');
  const {
    sections,
    results,
    toggleSection,
  } = props;
  const isAvailable = results.filter(result => result.isActive).length;
  return (
    <div {...classes()}>
      <div {...classes('filter')}>
        {sections
          .map(section => <SearchSection {...section} onClick={() => toggleSection(section)} />)
        }
      </div>
      <div {...classes('list')}>
        {isAvailable
          ? results
              .filter(result => result.isActive)
              .map(result => <Result {...result} />)        
          : <EmptyState message={'No results'} />
        }
      </div>
      {isAvailable && <div {...classes('pagination')}>
        <Pagination pages={10} currentPage={1} path={''} />
      </div>}
    </div>
  );
}
