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
 * Created: May 11, 2017
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Link,
  Avatar,
} from 'arachne-ui-components';
import moment from 'moment-timezone';
import { shortDate as defaultDateFormat } from 'const/formats';
import {
  apiPaths,
  paths,
} from 'const/activity';

require('./style.scss');

function Comment(props) {
  const classes = new BEMHelper('comment');
  const {
    date,
    text,
    user: {
      id: userId,
      firstname,
      lastname,
    },
    dateFormat = defaultDateFormat,
    //
    ResponseDetail = null,
  } = props;

  return (
    <div {...classes()}>
      <div {...classes('userpic')}>
        <Avatar img={ apiPaths.userpic(userId) }/>
      </div>
      <div {...classes('content')}>
        <span {...classes('heading')}>
          <span {...classes('author')}>
            <Link to={ paths.user(userId) }>
              { firstname } { lastname }
            </Link>
            {ResponseDetail}
          </span>
          <span
            {...classes('date')}
            title={ moment(date).tz(moment.tz.guess()).format(defaultDateFormat) }
          >
            { moment(date).tz(moment.tz.guess()).format(dateFormat) }
          </span>
        </span>
        <div {...classes('description')}>
          { text }
        </div>
        {/*<div {...classes('actions')}>
          {actionList && actionList.map((action, key) => 
            <Link 
              {...classes('action')} 
              key={key}>
              {action.label}
            </Link>
            )         
          }
        </div>*/}
      </div>
    </div>
  )
}

export default Comment;
