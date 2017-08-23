import { connect } from 'react-redux';
import { Component } from 'react';
import { get } from 'lodash';
import presenter from './presenter';
import selectors from './selectors';
import {
  ITermConnectionsTableStateProps,
  ITermConnectionsTableDispatchProps,
  ITermConnectionsTableProps,
} from './presenter';

class TermConnectionsTable extends Component<ITermConnectionsTableProps, {}> {
  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: Object, ownProps: Object): ITermConnectionsTableStateProps {
  const connections = selectors.getConnections(state);

  return {
    connections,
  };
}

const mapDispatchToProps = {
};

export default connect<ITermConnectionsTableStateProps, ITermConnectionsTableDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps
)(TermConnectionsTable);
