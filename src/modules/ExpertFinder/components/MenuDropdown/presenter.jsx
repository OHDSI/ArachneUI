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
 * Created: January 24, 2017
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import { Avatar } from 'arachne-ui-components';
import { apiPaths, paths } from 'modules/ExpertFinder/const';
import { Link } from 'arachne-ui-components';
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';

require('./style.scss');

function MenuDropdown(props) {
  const classes = new BEMHelper('profile-menu-item');
  let dropdownInstance;

  return (
    <Dropdown
      ref={(element) => { if (element) dropdownInstance = element; }}
      {...classes()}
    >
      <DropdownTrigger {...classes('header')}>
        <div {...classes('user-pic')}>
          <Avatar img={apiPaths.myUserpic({ hash: props.hash })} />
        </div>
        <div {...classes('user-name')}>
          {props.firstName &&
            <span {...classes('user-name-part')}>{props.firstName}</span>
          }
          {props.middleName &&
            <span {...classes('user-name-part')}>{props.middleName}</span>
          }
          {props.lastName &&
            <span {...classes('user-name-part')}>{props.lastName}</span>
          }
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
            to={paths.profile(props.id)}>User Profile</Link>
          <Link
            {...classes('dropdown-link')}
            to={paths.settings()}>Settings</Link>
          <Link
            {...classes('dropdown-link')}
            to={paths.datasources()}>My datasources</Link>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}

MenuDropdown.propTypes = {
  id: PropTypes.number,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  middleName: PropTypes.string,
};

export default MenuDropdown;
