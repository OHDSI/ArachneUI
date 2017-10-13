/**
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
 * Created: August 30, 2017
 *
 */

import React, { PropTypes } from 'react';
import TitleLabeled from 'components/TitleLabeled';
import LabelUser from 'components/LabelUser';
import BEMHelper from 'services/BemHelper';
import {
  Avatar,
  Link,
} from 'arachne-ui-components';

require('./style.scss');

function Card(props) {
  const classes = new BEMHelper('card');
  const {
    title,
    status,
    titleLabel,
    labelDescr,
    children,
    favourite,
    setFavourite,
    userList,
    usersExpanded,
    date,
    toggleUsers,
    footerExtra,
  } = props;

  return (
    <div {...classes()}>
      <div {...classes('heading')}>
        <div {...classes('title')}>
          {title}
        </div>
        <div {...classes('status')}>
          {status}
        </div>
      </div>
      <div {...classes('date')}>
        {date}
      </div>
      <div {...classes('body')}>
        {children}
      </div>
      <div {...classes('footer')}>
        <div {...classes({ element: 'users', modifiers: { expanded: usersExpanded } })}>
          <div {...classes('lead-avatar')}>
            <Avatar />
          </div>
          <div {...classes({ element: 'users-wrapper', modifiers: { expanded: usersExpanded } })}>
            {userList.map((user, i) => [
              <LabelUser
                user={user}
                showAvatar={false}
              />,
              i < userList.length - 1 ? <span {...classes('comma')}>, </span> : null,
            ]
            )}
            <Link
              {...classes({
                element: 'ellipsis',
                modifiers: { hidden: userList.length === 1 || usersExpanded },
              })}
              onClick={toggleUsers}
            >...</Link>
          </div>
        </div>
        {footerExtra}
      </div>
    </div>
  );
}

Card.propTypes = {
};

export default Card;