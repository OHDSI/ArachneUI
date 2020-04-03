/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
import { apiPaths, paths } from 'modules/Auth/const';
import { paths as VocabularyPaths } from 'modules/Vocabulary/const';
import { paths as AdminPaths } from 'modules/Admin/const';
import { Avatar, Link } from 'arachne-ui-components';
import Dropdown from 'react-simple-dropdown';
import { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import {
  NavItem,
} from 'components';

require('./style.scss');

interface IUserMenuState {
  isLoggedIn: boolean,
  fullname: string,
  isAdmin: boolean,
}

interface IUserMenuDispatch {
  loadPrincipal: Function,
  resetPrincipal: Function,
  logoutLocal: Function,
  logoutSLO: Function,
};

interface IUserMenuProps extends IUserMenuState, IUserMenuDispatch {};

function UserMenu(props) {
  const classes = BEMHelper('user-menu');
  const {
    isLoggedIn,
    hash,
    fullname,
    logout,
    isAdmin,
  } = props;
  let dropdownInstance;

  if (isLoggedIn) {
    return (
      <Dropdown
        ref={(element) => { if (element) dropdownInstance = element; }}
        {...classes()}
      >
        <DropdownTrigger {...classes('header')}>
          <div {...classes('user-pic-container')}>
            <i {...classes('user-pic')}>person</i>
          </div>
          <div {...classes('user-name')}>
            {fullname}
          </div>
          <span {...classes('arrow')}>play_arrow</span>
        </DropdownTrigger>
        <DropdownContent {...classes('content-wrapper')}>
          <div
            {...classes('content')}
            onClick={() => {
              dropdownInstance.hide();
            }}
            >
            <Link
              {...classes('dropdown-link')}
              to={VocabularyPaths.history()}>Downloads</Link>
            {isAdmin &&
              <Link
                {...classes('dropdown-link')}
                to={AdminPaths.licenses(false)}>Licenses</Link>
            }
            {isAdmin &&
            <Link
                {...classes('dropdown-link')}
                to={AdminPaths.statistics}>Statistics</Link>
            }
            <Link
              {...classes('dropdown-link')}
              onClick={logout}
            >
              Logout
            </Link>
          </div>
        </DropdownContent>
      </Dropdown>
    );
  } else {
    return (
      <NavItem module='auth' path={paths.login()} name="Login" />
    )
  }
  
}

export default UserMenu;
export {
  IUserMenuState,
  IUserMenuDispatch,
  IUserMenuProps,
};
