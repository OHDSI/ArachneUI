import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import { NavItem as INavItem } from 'modules/IModule';
import {
  Link,
} from 'arachne-components';

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
