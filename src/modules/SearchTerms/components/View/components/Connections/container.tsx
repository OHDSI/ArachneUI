import { connect } from 'react-redux';
import { Component } from 'react';
import { push as goToPage } from 'react-router-redux';
import { paths, defaultLevels, defaultStandardsOnly } from 'modules/SearchTerms/const';
import { get, has } from 'lodash';
import actions from 'modules/SearchTerms/actions';
import presenter from './presenter';
import selectors from './selectors';
import {
  ITermConnectionsStateProps,
  ITermConnectionsDispatchProps,
  ITermConnectionsProps,
} from './presenter';
import * as URI from 'urijs';

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
  const termFilters = selectors.getTermFilters(state);

  return {
    terms: connections.terms, 
    links: connections.links,
    isInProgress,
    termFilters,
  };
}

const mapDispatchToProps = {
  goToAddress: (address: string) => goToPage(address),
  setLoadingStatus: actions.graph.setLoadingStatus,
};

function mergeProps(stateProps: ITermConnectionsStateProps,
  dispatchProps: ITermConnectionsDispatchProps,
  ownProps: any) : ITermConnectionsProps {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToTerm: (id) => {
      const address = new URI(paths.term(id));
      address.search(stateProps.termFilters);
      dispatchProps.goToAddress(address.href());
    }
  }
}

export default connect<ITermConnectionsStateProps, ITermConnectionsDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps
)(TermConnections);
