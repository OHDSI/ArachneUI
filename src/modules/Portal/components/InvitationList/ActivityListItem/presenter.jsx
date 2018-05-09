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
 * Created: May 23, 2017
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import { Avatar } from 'arachne-ui-components';
import { Link } from 'arachne-ui-components';
import { Button } from 'arachne-ui-components';

require('./style.scss');

function ActivityListItem(props) {
  const classes = new BEMHelper('activity-list-item');
  const {
    actionList,
    actionType,
    comment,
    date,
    entity,
    id,
    doAction,
    readStatus,
    type,
    user,
    userPic,
  } = props;

  return (
    <li {...classes({ modifiers: readStatus })}>
      <div {...classes('avatar')}>
        <Avatar img={userPic} />
      </div>
      <div {...classes('content')}>
        
        <span {...classes('description')}>
          <Link to={user.profilePath} {...classes('author')}>
            {user.firstname} {user.lastname}
          </Link>
          <span {...classes('action-type')}>{actionType}</span>
          <Link {...classes('entity')} to={entity.path}>
            {entity.title}
          </Link>
        </span>

        {comment &&
          <span {...classes('comment')}>
            "{comment}"
          </span>
        }
        
        {actionList &&
          <div {...classes('actions')}>
            {actionList.map((action, key) =>
              <Button
                {...classes('action')}
                key={key}
                mods={['rounded', action.type]}
                onClick={() => doAction(action.type, id, type)}
              >
                {action.label}
              </Button>
              )
            }
          </div>
        }
        <div {...classes('date')}>
          {date}
        </div>
      </div>
    </li>
  );
}

export function getTextActivity(props) {
  const {
    actionType,
    comment,
    entity,
    user,
    userPic,
  } = props;

  return {
    body: `${user.firstname} ${user.lastname} ${actionType} ${entity.title}\n ${comment ? '"{comment}"' : ''}`,
    icon: userPic,
  };
}

ActivityListItem.propTypes = {
  actionList: PropTypes.array.isRequired,
  actionType: PropTypes.string,
  date: PropTypes.string,
  entity: PropTypes.object,
  id: PropTypes.number,
  performAction: PropTypes.func,
  readStatus: PropTypes.oneOf(['read', 'unread']),
  type: PropTypes.string,
  user: PropTypes.object,
  userPic: PropTypes.string,
};

export default ActivityListItem;
