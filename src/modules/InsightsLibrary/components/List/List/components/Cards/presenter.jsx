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
 * Created: August 25, 2017
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import EmptyState from 'components/EmptyState';
import Card from './Card';

require('./style.scss');

function InsightsList(props) {
  const classes = new BEMHelper('insight-list-cards');
  const {
    insightList,
    isLoading,
    setSorting,
    sorting,
    setFavourite,
    toggleParticipants,
    participantsExpanded,
  } = props;

  return (
    <div {...classes()}>
      {insightList.map((insight, i) => <Card
        key={i}
        {...insight}
        setFavourite={setFavourite}
        participantsExpanded={participantsExpanded}
        toggleParticipants={toggleParticipants}
      />)}
    </div>
  );
}

export default InsightsList;
