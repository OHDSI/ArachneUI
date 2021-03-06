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
  * Authors: Alexander Saltykov
  * Created: June 26, 2018
  *
  */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  ListItem,
} from 'arachne-ui-components';

import './style.scss';

function ViewCommonData({ description, organization }) {
  const classes = new BEMHelper('view-common-data');

  return (
    <div {...classes()}>
      <ListItem>
        <div {...classes('attribute')}>
          <span {...classes('label')}>Organization</span>
          <span>{organization.name}</span>
        </div>
      </ListItem>
      <div {...classes('list-item')}>
        <div {...classes('label', 'tall')}>Description</div>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default ViewCommonData;
