import { connect } from 'react-redux';
import { Component } from 'react';
import * as get from 'lodash/get';
import { push as goToPage } from 'react-router-redux';
import coreActions from 'modules/Auth/actions/core';
import logoutActions from 'modules/Auth/actions/logout';
import principalActions from 'modules/Auth/actions/principal';
import { roles } from 'modules/Auth/const';
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
      if (props.isLoggedIn)
        this.props.loadPrincipal();
      else
        this.props.resetPrincipal();
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
  const userRoles = get(state, 'auth.principal.data.roles', []) || [];
  const isAdmin = userRoles.map(role => role.name).includes(roles.ROLE_ADMIN);

  return {
    isLoggedIn: !!get(state, 'auth.core.token', ''),
    fullname,
    isAdmin,
  };
}

const mapDispatchToProps = function(dispatch) {
  return {
    loadPrincipal: () => dispatch(principalActions.load()),
    resetPrincipal: () => dispatch(principalActions.reset),
    logoutLocal: () => {
        dispatch(coreActions.setToken(null));
        dispatch(goToPage('/'));
    },
    logoutSLO: (dispatch) => {
      window.open('/auth/slo', 'SSO logout', "width=600,height=450,scrollbars=no");
    }
  }
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    logout: ({ user, vocabulary }) => {
      dispatchProps.logoutSLO();
      dispatchProps.logoutLocal();
    },
  };
}
export default connect<IUserMenuState, IUserMenuDispatch, {}>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(UserMenu);
