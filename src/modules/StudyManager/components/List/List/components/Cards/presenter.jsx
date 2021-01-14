/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
 * Created: August 30, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import EmptyState from 'components/EmptyState';
import Card from './Card';

require('./style.scss');

function StudiesList(props) {
  const classes = new BEMHelper('studies-cards');
  const { data } = props;

  return (
    <div {...classes()}>
      {data.map(study => <Card key={study.id} {...study} {...props} />)}
      {!data || !data.length
        ? <EmptyState message={'No data available'} />
        : null
      }
    </div>
  );
}

export default StudiesList;
