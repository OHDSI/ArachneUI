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
 * Created: December 13, 2016
 *
 */

// @ts-check
import React, { Component } from 'react';
import { Select, Panel } from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import StudyStatus from 'modules/StudyManager/components/Status';

import './style.scss';

/** @augments { Component<any, any> } */
class StudySettings extends Component {
  constructor() {
    super();
    this.classes = BEMHelper('study-settings');
    this.headerClasses = BEMHelper('study-settings-header');
  }

  getHeader() {
    const header = [      
      <span {...this.headerClasses({ element: 'group', modifiers: { wide: !this.props.isEditable } })}>Type of Study</span>,
      <span {...this.headerClasses('group')}>Status</span>,
    ];

    return header;
  }

  getSettings() {
    return [
      <li {...this.classes({ element: 'group', modifiers: { wide: !this.props.isEditable, uneditable: !this.props.isEditable } })}>
        {this.props.isEditable ?
          <Select
            mods={['bordered']}
            placeholder="Type"
            value={this.props.typeSelected.value}
            options={this.props.typeOptions}
            onChange={this.props.setType}
          />
          :
          <span {...this.classes('label')}>
            {this.props.typeSelected.label}
          </span>
        }
      </li>,
      <li  {...this.classes({ element: 'group', modifiers: { uneditable: !this.props.isEditable } })}>
        {this.props.isEditable ?
          <Select
            {...this.classes('status')}
            mods={['bordered', 'no-label-padding']}
            placeholder="Status"
            value={this.props.statusSelected.value}
            isMulti={false}
            options={this.props.statusOptions.map(option => ({
                label: <StudyStatus {...option} />,
                value: option.value,
              })
            )}
            onChange={this.props.setStatus}
          />
          :
          <StudyStatus {...this.props.statusSelected} />
        }
      </li>,
    ];
  }

  render() {
    return (
      <Panel title={
          <div {...this.headerClasses()}>
            {this.getHeader()}
          </div>
        }>
        <ul {...this.classes()}>
          {this.getSettings()}
        </ul>
      </Panel>
    );
  }
}

export default StudySettings;
