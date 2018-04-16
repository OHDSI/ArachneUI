/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexandr Saltykov, Pavel Grafkin, Vitaly Koulakov, Anton Gackovka
 * Created: March 3, 2017
 *
 */

import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import { NavItem as INavItem } from 'modules/IModule';
import {
  Link,
} from 'arachne-ui-components';

require('./style.scss');

function NavItem(props: INavItem) {
  const {
    children,
    name,
    onClick,
    path,
    isActive,
  } = props;
  const classes = BEMHelper('nav-item');

  return path ?
    <Link to={path} {...classes({ modifiers: { selected: isActive } })}>
      {name}
    </Link>
    :
    <div {...classes({ modifiers: { 'no-link': true, selected: isActive } })} onClick={onClick}>
      {children}
    </div>
}

export default NavItem;
