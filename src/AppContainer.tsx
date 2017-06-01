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
import {
  NavItem,
} from 'components';
import AboutInfo from 'modules/Portal/components/AboutInfo';
import imgs from 'const/images';

require('./styles/appContainer.scss');

interface IAppState extends Props<App> {
  isUserAuthed: boolean;
};

interface IAppDispatch {
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
        <AboutInfo />
      </div>
    );
  }
}

function mapStateToProps(state: any): IAppState {
  const isUserAuthed = true;

  return {
    isUserAuthed,
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