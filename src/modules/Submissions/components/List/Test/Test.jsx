import React, { Component } from 'react';
import { ContainerBuilder } from '../../../../../services/Utils';


class Comp extends Component {
  componentDidMount() {
  }
  render() {
    return <div>cat</div>
  }
}

class Test extends ContainerBuilder {
  getComponent() {
    return Comp;
  }
  mapStateToProps(state) {
    return {

    };
  }

  getMapDispatchToProps() {
    return {

    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...ownProps,
      ...dispatchProps,
    };
  }
}


export default Test;