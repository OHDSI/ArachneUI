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
