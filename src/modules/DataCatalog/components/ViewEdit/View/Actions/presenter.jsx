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
 * Created: June 14, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Button,
  Tabs
} from 'arachne-ui-components';

require('./style.scss');

function Actions({
	openAddModal,
  onChangeTab,
  isProfileSelected,
  isVirtual,
  reportsAvailable,
}) {
  const classes = new BEMHelper('data-source-actions');

  const tabList = [
    {
      label: 'General',
      value: '',
    },
    {
      label: 'Datasource profile',
      value: 'profile',
    },
  ];

  if (isVirtual) {
    return null;
  }

  return (
    <div {...classes()}>
      <Button
        {...classes('invite-button')}
        mods={['success']}
        onClick={openAddModal}>
        Request access
      </Button>
      {reportsAvailable &&
      	<Tabs
          {...classes('tabs')}
          value={tabList[isProfileSelected ? 1 : 0].value}
          options={tabList}
          onChange={onChangeTab}
          mods={['bordered']}
        />
      }
    </div>
  );
}

export default Actions;
