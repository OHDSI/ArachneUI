import * as React from 'react';
import BEMHelper from 'services/BemHelper';
import { apiPaths, paths } from 'modules/Auth/const';
import { Avatar, Link } from 'arachne-components';
import Dropdown from 'react-simple-dropdown';
import { DropdownTrigger, DropdownContent } from 'react-simple-dropdown';

require('./style.scss');

interface IUserMenuState {
  isLoggedIn: boolean,
  fullname: string,
}

interface IUserMenuDispatch {
  logout: Function,
};

interface IUserMenuProps extends IUserMenuState, IUserMenuDispatch {};

function UserMenu(props) {
  const classes = BEMHelper('user-menu');
  const {
    isLoggedIn,
    hash,
    fullname,
    logout,
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
              onClick={logout}>Logout</Link>
          </div>
        </DropdownContent>
      </Dropdown>
    );
  } else {
    return (
      <Link to={paths.login()}>Login</Link>
    )
  }
  
}

export default UserMenu;
export {
  IUserMenuState,
  IUserMenuDispatch,
  IUserMenuProps,
};
