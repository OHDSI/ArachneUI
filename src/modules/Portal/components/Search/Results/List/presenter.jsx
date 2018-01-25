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
import {
  Link,
  ListItem,
} from 'arachne-ui-components';
import EmptyState from 'components/EmptyState';

import './style.scss';

export function Domain(props) {
  const {
    label,
    value,
    forFilter = false,
  } = props;
  const classes = BEMHelper('search-result-list-item-domain');

  return (
    <span {...classes({ modifiers: [value, forFilter ? 'filter' : 'list'] })}>
      <span {...classes('text')}>{label}</span>
    </span>
  );
}

function ResultItem(props) {
  const {
    title,
    description,
    path,
    domain,
    breadcrumbs,
  } = props;
  const classes = BEMHelper('search-result-list-item');

  return (
    <div {...classes()}>
      <Link {...classes('title')} to={path}>{title}</Link>
      <Domain label={domain.label} value={domain.value} />
      <div {...classes('description')}>{description}</div>
      {breadcrumbs &&
        <ul {...classes('breadcrumbs')}>
          {breadcrumbs.map(crumb => <Crumb {...crumb} />)}
        </ul>
      }
    </div>
  );
}

function Crumb(props) {
  const {
    title,
    path,
    domain,
  } = props;
  const classes = BEMHelper('search-result-item-crumb');

  return (
    <Link {...classes()} to={path}>{title}</Link>
  );
}

export default function SearchResultsList(props) {
  const classes = BEMHelper('search-result-list');
  const {
    results,
  } = props;

  return (
    <div {...classes()}>
      <div {...classes('list')}>
        {results && results.length
          ? results.map(result => <ResultItem {...result} />)
          : <EmptyState message={'No results'} />
        }
      </div>
    </div>
  );
}
