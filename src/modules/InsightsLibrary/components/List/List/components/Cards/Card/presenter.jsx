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
 * Created: August 30, 2017
 *
 */

import React, { PropTypes } from 'react';
import moment from 'moment';
import { usDateOnly } from 'const/formats';
import clamp from 'clamp-js';
import BEMHelper from 'services/BemHelper';
import Card from 'components/Card';
import { publishStateOptions, paths } from 'modules/InsightsLibrary/const';
import { get } from 'services/Utils';
import { Title } from './fields';

require('./style.scss');

function InsightCard(props) {
  const classes = new BEMHelper('insight-list-card');
  const {
    id,
    publishState,
    publishedDate,
    favourite,
    study: {
      title,
      objective,
      participants,
      startDate,
      endDate,
    },
    setFavourite,
  } = props;

  const titleEl = (
    <Title
      {...classes('title')}
      mods={['large', 'nowrap']}
      title={title}
      link={paths.insights({ insightId: id })}
      isFavourite={favourite}
      toggleFavorite={() => setFavourite(id, !favourite)}
      titleLabel={publishState === 'DRAFT' ? 'DRAFT' : null}
      titleLabelDescr={get(publishStateOptions.filter(opt => opt.value === 'DRAFT')[0], 'tooltip')}
      {...props}
    />
  );

  const dates = (
    <div {...classes('dates')}>
      <span {...classes('ico')}>date_range</span>
      {moment(startDate).format(usDateOnly)}
      <span {...classes('ico', 'reversed')}>keyboard_backspace</span>
      {moment(endDate).format(usDateOnly)}
    </div>
  );

  return (
    <Card
      title={titleEl}
      date={publishedDate ? <span>Published: {moment(publishedDate).format(usDateOnly)}</span> : null}
      userList={participants.map(user => ({
        id: user.id,
        name: user.label,
      }))}
      footerExtra={dates}
    >
      <p
        ref={(el) => {
          el && clamp(el, { clamp: 3, useNativeClamp: false, truncationChar: '...', height: 43 });
        }}
      >
        {objective}
      </p>
    </Card>
  );
}

InsightCard.propTypes = {
  id: PropTypes.number,
  publishState: PropTypes.bool,
  publishedDate: PropTypes.string,
  favourite: PropTypes.bool,
  study: PropTypes.shape({
    title: PropTypes.string,
    objective: PropTypes.string,
    participants: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      label: PropTypes.string,
    })),
    created: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }),
  setFavourite: PropTypes.func,
  toggleParticipants: PropTypes.func,
  participantsExpanded: PropTypes.bool,
};

export default InsightCard;
