import React = require('react');
import { Component, Props } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

interface AppProps extends Props<App> {};

interface AppState {
  /* empty */
}

class App extends Component<AppProps, AppState>{
  render() {
    return (
      <div>
        <div>Navbar here!</div>
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