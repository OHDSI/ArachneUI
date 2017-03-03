import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

interface AppProps { // extends
  someProp: number;
  // children 
};

interface AppState {
  /* empty */
}

class App extends React.Component<AppProps, AppState>{
  render() {
    return (
      <div>12345</div>
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