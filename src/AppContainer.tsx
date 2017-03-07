import React = require('react');
import { Component, Props } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import BEMHelper from 'services/BemHelper';
import {
  Header,
} from 'arachne-components';
import imgs from 'const/images';

require('./styles/appContainer.scss');

interface AppProps extends Props<App> {};

interface AppState {
  /* empty */
}

class App extends Component<AppProps, AppState>{

  render() {
    const classes = BEMHelper('root');
    const isUserAuthed = true;

    return (
      <div {...classes()}>        
        <Header
          isUserAuthed={isUserAuthed}
          logo={imgs.header.logo}
          navItems={[]}
        />
        {this.props.children}
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
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