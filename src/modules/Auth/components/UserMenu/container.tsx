import { connect } from 'react-redux';
import { Component } from 'react';
import * as get from 'lodash/get';
import coreActions from 'modules/Auth/actions/core';
import principalActions from 'modules/Auth/actions/principal';
import presenter from './presenter';
import {
  IUserMenuState,
  IUserMenuDispatch,
  IUserMenuProps
} from './presenter';

interface IUserMenuStatefulDispatch {
  loadPrincipal: Function;
}

class UserMenu extends Component<IUserMenuProps & IUserMenuStatefulDispatch, {}> {
  componentWillMount() {
    if (this.props.isLoggedIn) {
      this.props.loadPrincipal();
    }
  }

  componentWillReceiveProps(props: IUserMenuProps) {
    if (this.props.isLoggedIn !== props.isLoggedIn) {
      this.props.loadPrincipal();
    }
  }

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state): IUserMenuState {
  const nameParts = [
    get(state, 'auth.principal.data.firstName', ''),
    get(state, 'auth.principal.data.lastName', '')
  ];
  const fullname = nameParts.filter(part => part).join(' ') || 'Anonymous';

  return {
    isLoggedIn: !!get(state, 'auth.core.token', ''),
    fullname,
  };
}

const mapDispatchToProps = {
  loadPrincipal: principalActions.load,
  logout: coreActions.logout,
};

export default connect<IUserMenuState, IUserMenuDispatch, void>(
  mapStateToProps,
  mapDispatchToProps
)(UserMenu);
