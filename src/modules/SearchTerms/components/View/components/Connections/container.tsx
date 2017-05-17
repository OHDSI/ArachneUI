import { connect } from 'react-redux';
import { Component } from 'react';
import { push as goToPage } from 'react-router-redux';
import { paths } from 'modules/SearchTerms/const';
import { get } from 'lodash';
import actions from 'modules/SearchTerms/actions';
import presenter from './presenter';
import selectors from './selectors';
import {
  ITermConnectionsStateProps,
  ITermConnectionsDispatchProps,
  ITermConnectionsProps,
} from './presenter';

class TermConnections extends Component<ITermConnectionsProps, {}> {
  componentWillMount() {
    this.props.setLoadingStatus(true);
  }

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: Object, ownProps: Object): ITermConnectionsStateProps {
  let connections = selectors.getConnections(state);
  const isInProgress = get(state, 'searchTerms.graph.isLoading', true);

  return {
    terms: connections.terms, 
    links: connections.links,
    isInProgress,
  };
}

const mapDispatchToProps = {
  goToTerm: (id: number) => goToPage(paths.term(id)),
  setLoadingStatus: actions.graph.setLoadingStatus,
};

export default connect<ITermConnectionsStateProps, ITermConnectionsDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps
)(TermConnections);
