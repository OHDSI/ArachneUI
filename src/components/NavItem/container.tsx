import { connect } from 'react-redux';
import { Component } from 'react';
import { get } from 'lodash';
import { NavItem as INavItem } from 'modules/IModule';
import presenter from './presenter';

interface INavitemDispatchProps {
}

interface INavitemStateProps {
}

interface INavitemProps extends INavitemStateProps, INavitemDispatchProps, INavItem {}

class NavItem extends Component<INavItem, void> {

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: Object, ownProps: INavItem): INavitemStateProps {
  const isActive = get(state, 'modules.active', '') === ownProps.module;

  return {
    isActive,
  };
}

const mapDispatchToProps = {
};

function mergeProps(
  stateProps: INavitemStateProps,
  dispatchProps: INavitemDispatchProps,
  ownProps: INavItem
) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
  };
}

export default connect<INavitemStateProps, INavitemDispatchProps, INavItem>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(NavItem);
