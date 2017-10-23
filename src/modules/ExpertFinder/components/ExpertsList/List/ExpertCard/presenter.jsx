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
 * Created: February 10, 2017
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import { Button } from 'arachne-ui-components';
import { Link } from 'arachne-ui-components';
import { Avatar } from 'arachne-ui-components';
import { apiPaths, paths } from 'modules/ExpertFinder/const';

require('./style.scss');

function ExpertCardAvatar({ url }) {
  const classes = new BEMHelper('expert-card-avatar');

  return (
    <div {...classes()}>
      <Avatar mods={['round', 'bordered']} img={url}/>
    </div>
  );
}


function ExpertCard(props) {
  const {
    expert,
    showInviteDialog,
    canBeInvited,
  } = props;
  const classes = new BEMHelper('expert-card');

  return (
    <div {...classes()}>
      <div {...classes('content')}>
        <div {...classes('avatar')}>
          <ExpertCardAvatar url={apiPaths.userpic(expert.id)}/>
        </div>
        <div {...classes('info')}>
          <div {...classes('title')}>
            <Link to={paths.profile(expert.id)} {...classes('name')}>
              {expert.name}
            </Link>
            {canBeInvited &&
              <Button mods={['success', 'rounded']} onClick={() => showInviteDialog(expert)}>Invite</Button>
            }
          </div>
          <span {...classes('professional')}>
            {expert.professionalType || ''}
            {expert.affiliation && expert.professionalType ? ', ' : ''}
            {expert.affiliation || ''}
          </span>
          <span>{expert.address}</span>
          <div {...classes('skill-list')}>
            {expert.skills.map((skill, key) => 
              <span {...classes('skill')} key={key}>
                {skill.name}{`${key!==expert.skills.length-1 ? ',' : ''}`}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

ExpertCard.propTypes = {
  expert: PropTypes.shape({
    id: PropTypes.number,
    userPic: PropTypes.string,
    address: PropTypes.string,
    affiliation: PropTypes.string,
    name: PropTypes.string,
    professionalType: PropTypes.string,
    skills: PropTypes.array,
  }),
  showInviteDialog: PropTypes.func,
  canBeInvited: PropTypes.bool,
};

export default ExpertCard;