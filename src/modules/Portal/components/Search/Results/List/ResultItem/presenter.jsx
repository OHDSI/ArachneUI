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
  Breadcrumbs,
} from 'arachne-ui-components';
import Domain from '../Domain';
import Highlight from './components/Highlight';

import './style.scss';

export default function ResultItem(props) {
  const {
    title,
    path,
    domain,
    breadcrumbs,
    highlight,
  } = props;
  const classes = BEMHelper('search-result-list-item');

  return (
    <div {...classes()}>
      <Domain {...domain} />
      <Link {...classes('title')} to={path}>{title}</Link>
      <div {...classes('description')}>{highlight.map(match =>
        <Highlight {...match} />
      )}</div>
      {breadcrumbs &&
        <Breadcrumbs {...classes('breadcrumbs')} data={breadcrumbs} />
      }
    </div>
  );
}
