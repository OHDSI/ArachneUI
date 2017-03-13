import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import { SideItem as ISideItem } from 'modules/IModule';
import {
  Link,
} from 'arachne-components';

require('./style.scss');

function SidebarItem(props: ISideItem) {
  const {
    ico,
    name,
    path,
  } = props;
  const classes = BEMHelper('sidebar-item');
  const sidebarContent = ico ?
    <div {...classes('icon-wrapper')}>
      <div {...classes('icon')}>{ico}</div>
      <span>{name}</span>
    </div>
    :
    <span>{name}</span>;

  return path ?
    <Link to={path} {...classes()}>
      {sidebarContent}
    </Link>
    :
    <div {...classes({ modifiers: 'no-link' })}>
      {sidebarContent}
    </div>
}

export default SidebarItem;
