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
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: June 04, 2017
 *
 */

import React from 'react';
import classNames from 'classnames';
import BEMHelper from 'services/BemHelper';
import statusColors from 'const/statusColors';

require('./style.scss');

function LabelSubmissionStatus({ className, mods, status, type = 'default' }) {
  const classes = new BEMHelper('label-submissions-status');
  const modifiers = classNames(
    status.value ? statusColors[status.value] : null,
    type,
    mods,
  );
  const defaultLabel = [
    <span key="1" {...classes('icon')}>open_in_new</span>,
    <span key="2" {...classes('title')}>{status.title}</span>,
  ];
  const dotLabel = [
    <span key="3" {...classes('dot')}>brightness_1</span>,
    <span key="4" {...classes('title')}>{status.title}</span>,
  ];

  return (
    <span {...classes({ modifiers, extra: className })} title={`Submission status: ${status.title}`}>
      {type === 'default' && defaultLabel}
      {type === 'dot' && dotLabel}
    </span>
  );
}

export default LabelSubmissionStatus;
