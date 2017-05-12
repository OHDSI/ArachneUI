import React = require('react');
import { ReactElement } from 'react';
import { Component, Props } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import BEMHelper from 'services/BemHelper';
import IModule from 'modules/IModule';
import { SideItem } from 'modules/IModule';
import {
  Header,
} from 'arachne-components';
import {
  SidebarItem,
} from 'components';
import imgs from 'const/images';

require('./styles/appContainer.scss');

interface IAppState extends Props<App> {
  isUserAuthed: boolean;
};

interface IAppDispatch {
  /* empty */
}

interface IAppOwnProps {
  navItems: Array<ReactElement<any>>;
}

interface IAppProps extends IAppState, IAppDispatch, IAppOwnProps {};

class App extends Component<IAppProps, {}> {

  render() {
    const classes = BEMHelper('root');

    return (
      <div {...classes()}>
        <Header
          {...classes({
            element: 'header',
            modifiers: { empty: this.props.navItems.length === 0 }
          })}
          isUserAuthed={this.props.isUserAuthed}
          logo={imgs.header.logo}
          navItems={this.props.navItems}
        />
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state: any): IAppState {
  const isUserAuthed = true;
  /*let navItems: Array<ReactElement<any>> = [];
  state.modules.list
    .filter((module: IModule) => module.sidebarElement)
    .map((module: IModule) => {
      navItems = navItems.concat(
        module.sidebarElement.map((item: SideItem) => <SidebarItem {...item} />)
      );
    });
  state.modules.list
    .filter((module: IModule) => module.navbarElement)
    .map((module: IModule) => {
      navItems = navItems.concat(module.navbarElement)
    });*/

  return {
    isUserAuthed,
    // navItems,
  };
}

function mapDispatchToProps(dispatch: Function): IAppDispatch {
  return {
  };
}

export default connect<IAppState, IAppDispatch, IAppOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(App);