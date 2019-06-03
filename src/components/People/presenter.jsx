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
 * Authors: Pavel Grafkin
 * Created: April 26, 2019
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  ListItem,
  Panel
} from 'arachne-ui-components';
import LabelUser from '../LabelUser';

require('./style.scss');

function People({ title, userList, children, remove }) {
  const classes = new BEMHelper('people-list');

  const listItemMods = [];
  !!remove && listItemMods.push('removable');

  return (
    <Panel title={title}>
      {userList.length ?
        <div {...classes()}>
          {userList.map(user =>
            <ListItem
              {...classes('user')}
              mods={listItemMods}
              onRemove={() => remove(user)}
            >
              <LabelUser mods="md" user={user} />
            </ListItem>
          )}
          {children}
        </div>
        :
        <div {...classes({ modifiers: 'empty' })}>
          <div>
            <ListItem label="Empty list"/>
          </div>
          {children}
        </div>
      }
    </Panel>
  )
}

export default People;
