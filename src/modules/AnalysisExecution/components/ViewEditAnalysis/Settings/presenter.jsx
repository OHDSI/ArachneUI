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
 * Created: May 17, 2017
 *
 */

import React from 'react';
import { Panel, Select, Tabs } from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';

require('./style.scss');

function AnalysisSettings(props) {
  const classes = new BEMHelper('analysis-settings');
  const headerClasses = new BEMHelper('analysis-settings-header');
  const {
    isEditable,

    typeOptions,
    typeSelected,
    setType,

    isCodeLocked,
    canLockCode,
    codeLock,
  } = props;

  const header = <div {...headerClasses()}>
    <span {...headerClasses('group')}>
      Type of Analysis
    </span>
    <span {...headerClasses('group')}>
      Code files lock
    </span>
  </div>;

  return (
    <Panel title={header}>
      <ul {...classes()}>
        <li 
          {...classes({
            element: 'group',
            modifiers: { uneditable: !isEditable } 
          })}
        >
            {isEditable ?
              <Select
                mods={['bordered']}
                placeholder="Type"
                value={typeSelected.value}
                options={typeOptions}
                onChange={setType}
              />
              :
              <span {...classes('label')}>
                {typeSelected.label}
              </span>
            }
        </li>
        <li {...classes({
          element: 'group',
          modifiers: ['uneditable'],
        })}>
          {canLockCode ?
            <Tabs
              value={ isCodeLocked }
              options={[
                {label: 'Lock', value: true, mods: ['purple']},
                {label: 'Unlock', value: false}
              ]}
              onChange={codeLock}
            />
            :
            <span {...classes('label')}>
              { isCodeLocked ? 'Locked' : 'Unlocked' }
            </span>
          }
        </li>
      </ul>
    </Panel>
  );
}

export default AnalysisSettings;