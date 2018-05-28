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
import { Avatar, Link } from 'arachne-ui-components';
import { apiPaths, paths } from 'modules/ExpertFinder/const';
import Dropdown, { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';
import Username from './Username';

require('./style.scss');

function MenuBlock({ menuItems, mods }) {
  const classes = new BEMHelper('profile-menu-block');

  return (
    <ul {...classes({ modifiers: mods })}>
      {menuItems.map(item =>
        <MenuItem {...item} classes={classes} />
      )}
    </ul>
  );
}

function MenuItem({ classes, link, innerMenuItems }) {
  return (
    <li {...classes('item')}>
      <MenuLink {...link} classes={classes} />
      {(innerMenuItems && innerMenuItems.length) ?
        <MenuBlock menuItems={innerMenuItems} mods={'inner'} />
        : null
      }
    </li>
  );
}

function MenuLink(props) {
  const {
    classes,
    sectionIco,
    text,
    url,
    onClick,
    subtext,
    rightIco,
  } = props;

  return (
    <Link {...classes('link')} to={url} onClick={onClick}>
      {sectionIco ?
        <i {...classes('link-ico', 'section')}>{sectionIco}</i>
        : null
      }
      <span {...classes('caption')}>
        <span {...classes('text')}>{text}</span>
        <span {...classes('subtext')}>
          {subtext}
        </span>
      </span>
      {rightIco ?
        <i {...classes('link-ico', 'right')}>{rightIco}</i>
        : null
      }
    </Link>
  );
}

function MenuDropdown(props) {
  const classes = new BEMHelper('profile-menu');
  const {
    isLoading,
    tenants,
    newActiveTenantId,
    setActiveTenant,
  } = props;

  let dropdownInstance;
  let activeTenant = 'Everyone';

  const tenantMenuItems = tenants.map((t) => {
    let statusIco;
    
    if (t.active) {
      activeTenant = t.name;
    }
    if (newActiveTenantId) {
      if (t.id === newActiveTenantId) {
        statusIco = 'hourglass_empty';
      }
    } else if (t.active) {
      statusIco = 'check';
    }

    return {
      link: {
        text: t.name,
        rightIco: statusIco,
        onClick: () => setActiveTenant({ activeTenantId: t.id }),
      },
    };
  });

  const menuItems = [
    {
      link: {
        sectionIco: 'people',
        text: 'Context',
        subtext: activeTenant,
        rightIco: 'keyboard_arrow_right',
      },
      innerMenuItems: tenantMenuItems,
    },
    {
      link: {
        sectionIco: 'portrait',
        text: 'User Profile',
        url: paths.profile(props.id),
      },
    },
    {
      link: {
        sectionIco: 'storage',
        text: 'My datasources',
        url: paths.datasources(),
      },
    },
    {
      link: {
        sectionIco: 'settings',
        text: 'Settings',
        url: paths.settings(),
      },
    },
  ];

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
          <Username />
        </div>
        <span {...classes('arrow')}>play_arrow</span>
      </DropdownTrigger>
      <DropdownContent {...classes('content-wrapper')}>
        <MenuBlock menuItems={menuItems} />
      </DropdownContent>
    </Dropdown>
  );
}

MenuDropdown.propTypes = {
  id: PropTypes.number,
};

export default MenuDropdown;
