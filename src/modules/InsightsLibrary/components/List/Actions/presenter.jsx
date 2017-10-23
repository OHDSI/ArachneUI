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
 * Created: July 19, 2017
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import { Button, Tabs } from 'arachne-ui-components';
import { viewModes, viewModesOptions } from 'const/viewModes';

require('./style.scss');

function ToolbarActions(props) {
  const {
    reload,
    isCardsView = false,
    setViewMode,
  } = props;
  const classes = new BEMHelper('insights-list-actions');

  const tabs = viewModesOptions.map(mode => ({
    ...mode,
    label: (
      <Button {...classes('btn')}>
        {mode.ico
          ? <i {...classes('btn-ico')}>{mode.ico}</i>
          : <span>{mode.label}</span>
        }
      </Button>
    ),
  }));

  return (
    <ul {...classes()}>
      <li {...classes('action')}>
        <Button {...classes('btn')} onClick={reload}>
          <i {...classes('btn-ico')}>refresh</i>
        </Button>
      </li>
      <li {...classes('action')}>
        <Tabs
          {...classes('tabs')}
          options={tabs}
          value={isCardsView ? viewModes.CARDS : viewModes.TABLE}
          onChange={() => setViewMode(isCardsView ? viewModes.TABLE : viewModes.CARDS)}
        />
      </li>
    </ul>
  );
}

export default ToolbarActions;
