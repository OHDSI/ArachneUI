import React = require('react');
import { ReactElement } from 'react';
import { Component, Props } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import BEMHelper from 'services/BemHelper';
import IModule from 'modules/IModule';
import {
  Header,
} from 'arachne-components';
import imgs from 'const/images';

require('./styles/appContainer.scss');

interface AppProps extends Props<App> {
  isUserAuthed: boolean;
  navItems: Array<ReactElement<any>>;
};

interface AppState {
  /* empty */
}

class App extends Component<AppProps, AppState>{

  render() {
    const classes = BEMHelper('root');

    return (
      <div {...classes()}>        
        <Header
          {...classes({ element: 'header', modifiers: { empty: this.props.navItems.length === 0 } })}
          isUserAuthed={this.props.isUserAuthed}
          logo={imgs.header.logo}
          navItems={this.props.navItems}
        />
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state: any): AppProps {
  const isUserAuthed = true;
  let navItems: Array<ReactElement<any>> = [];
  state.modules.list
    .filter((module: IModule) => module.navbarElement)
    .map((module: IModule) => {
      navItems = navItems.concat(module.navbarElement)
    });

  return {
    isUserAuthed,
    navItems,
  };
}

function mapDispatchToProps(dispatch: Function) {
  return {
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);