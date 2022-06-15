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
 * Authors: Pavel Grafkin, Alexander Saltykov
 * Created: March 01, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';

require('./style.scss');

function TableCellEmail({ className, mods, value, index }) {
  const classes = new BEMHelper('table-cell-email');

  return (
    <span title={value} key={index + 'table-cell-email-span'} {...classes({ modifiers: mods, extra: className })}>
      {value}
    </span>
  );
}

export default TableCellEmail;
