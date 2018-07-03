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
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka
 * Created: May 9, 2018
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import {
  apiPaths as expertApiPaths
} from 'modules/ExpertFinder/const';

require('./style.scss');

function Username({ mods, name }) {
  const classes = new BEMHelper('profile-menu-username');

  return (
    <div>
      <span {...classes({ modifiers: mods })}>{name}</span>
    </div>
  );
}

export default Username;
