import { connect } from 'react-redux';
import { Component } from 'react';
import * as get from 'lodash/get';
import actions from 'modules/Auth/actions/index';
import presenter from './presenter';
import {
  IUserMenuState,
  IUserMenuDispatch,
  IUserMenuProps
} from './presenter';

class UserMenu extends Component<IUserMenuProps, {}> {
  componentWillMount() {
    // this.props.loadMyProfile();
  }

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state): IUserMenuState {
  const id = 1;
  const fullname = 'Pavel Grafkin';
  const hash = '123';

  return {
    id,
    isLoggedIn: !!get(state, 'auth.core.token', ''),
    hash,
    fullname,
  };
}

const mapDispatchToProps = {
  // loadMyProfile: actions.myProfile.loadMyProfile,
  logout: actions.core.logout,
};

export default connect<IUserMenuState, IUserMenuDispatch, void>(
  mapStateToProps,
  mapDispatchToProps
)(UserMenu);
