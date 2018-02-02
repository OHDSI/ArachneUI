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
 * Authors: Alexander Saltykov
 * Created: January 19, 2018
 *
 */

import React from 'react';
import {
  FormInput,
  Panel,
} from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';

import './style.scss';

function Rule({ description, rules }) {
  const classes = BEMHelper('password-field');

  return (
    <li {...classes('rule')}>
      {description}
      {rules &&
        <ul>
          {rules.map(rule => <Rule {...rule} />)}
        </ul>
      }
    </li>
  );
}

export default function PasswordField(props) {
  const classes = BEMHelper('password-field');
  const {
    placeholder = 'Password',
    tooltipConfig = 'top multiline',
    showHint = true,
    rules = [],
    setInstance,
    setIsCollapsed,
  } = props;

  return (
    <div {...classes()}>
      <FormInput {...props} placeholder={placeholder} type={'password'} />
      {showHint && rules.length
        ?
          <Dropdown
            {...classes('dropdown')}
            ref={(el) => {
              if (el) {
                setInstance(el);
              }
            }}
          >
            <DropdownTrigger {...classes('icon')}>
              <div
                {...classes('hint')}
                onMouseOver={() => setIsCollapsed(false)}
                onMouseOut={() => setIsCollapsed(true)}
              >help</div>
            </DropdownTrigger>
            <DropdownContent>
              <Panel
                title="Password policy"
                mods="black-header"
                {...classes('content')}
              >
                <ul {...classes('rules')}>
                  {rules.map(rule => <Rule {...rule} />)}
                </ul>
              </Panel>
            </DropdownContent>
          </Dropdown>
        : null
      }
    </div>
  );
}
