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
 * Created: September 13, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import LabelUser from 'components/LabelUser';
import { Panel } from 'arachne-components';

export function People({ title, userList }) {
  const classes = new BEMHelper('insight-view-data-people');

  return (
    <Panel title={title}>
      {userList.length ?
        <div {...classes()}>
          {userList.map(user => 
            <div {...classes('user')}>
              <LabelUser mods="md" user={user} />
            </div>
          )}
        </div>
        :
        <div {...classes({ modifiers: 'empty' })}>
          Empty list
        </div>
      }
    </Panel>
  )
}

export default class PeopleBuilder {
  constructor(props, bemHelper) {
    this.leadList = props.insight.leadList;
    this.participants = props.insight.participants;
    this.bemHelper = bemHelper;
  }

  build() {
    const people = [
      <div {...this.bemHelper('leads')}>
        <People title="Lead investigators" userList={this.leadList} />
      </div>,
      <div {...this.bemHelper('participants')}>
        <People title="Contributors" userList={this.participants} />
      </div>,
    ];

    return people;
  }
}
