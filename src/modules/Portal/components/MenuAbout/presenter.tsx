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
import {
  BadgedIcon,
  Modal,
  LoadingPanel,
  Link
} from 'arachne-ui-components';
import {
  paths,
  images
} from 'modules/Portal/const';
import {
  NavItem,
} from 'components';

require('./style.scss');

interface IAboutInfo {
  openModal: Function,
}

function MenuAbout({ openModal }) {
  const classes = BEMHelper('menu-about-info-ico');

  return (
    <NavItem onClick={openModal}>
      <i {...classes()}>help_outline</i>
    </NavItem>
  )
}

export default MenuAbout;
