import { connect } from 'react-redux';
import { Component } from 'react';
import { goBack, push as goToPage } from 'react-router-redux';
import { paths } from 'modules/SearchTerms/const';
import { get } from 'lodash';
import presenter from './presenter';
import selectors from './selectors';
import {
  ITermConnectionsStateProps,
  ITermConnectionsDispatchProps,
  ITermConnectionsProps,
} from './presenter';

class TermConnections extends Component<ITermConnectionsProps, {}> {
  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: Object, ownProps: Object): ITermConnectionsStateProps {
  let connections = selectors.getConnections(state);

  return {
    terms: connections.terms, 
    links: connections.links,
  };
}

const mapDispatchToProps = {
  goToTerm: (id: number) => goToPage(paths.term(id)),
};

export default connect<ITermConnectionsStateProps, ITermConnectionsDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps
)(TermConnections);
