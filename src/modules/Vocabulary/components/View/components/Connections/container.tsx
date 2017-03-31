import { connect } from 'react-redux';
import { Component } from 'react';
import actions from 'modules/SearchTerms/actions';
import { goBack } from 'react-router-redux';
import { get } from 'lodash';
import presenter from './presenter';
import selectors from './selectors';
import {
  ITermConnectionsProps,
} from './presenter';

class TermConnections extends Component<ITermConnectionsProps, {}> {
  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: Object): ITermConnectionsProps {
  const connections = selectors.getConnections(state);

  return {
    terms: connections.terms, 
    links: connections.links,
  };
}

const mapDispatchToProps = {
};

export default connect<ITermConnectionsProps, {}, {}>(
  mapStateToProps,
  mapDispatchToProps
)(TermConnections);
