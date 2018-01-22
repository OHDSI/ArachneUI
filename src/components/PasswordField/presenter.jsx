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
} from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';

import './style.scss';

export default function PasswordField(props) {
  const classes = BEMHelper('password-field');
  const {
    placeholder = 'Password',
    hint = 'Password validation rules',
    tooltipConfig = 'top',
    showHint = true,
  } = props;

  return (
    <div {...classes()}>
      <FormInput {...props} placeholder={placeholder} type={'password'} />
      {showHint &&
        <div {...classes('hint', '', 'ac-tooltip')} aria-label={hint} data-tootik-conf={tooltipConfig}>
          help
        </div>
      }
    </div>
  );
}
