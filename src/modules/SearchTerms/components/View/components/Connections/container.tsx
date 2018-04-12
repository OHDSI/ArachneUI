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
  GraphConnection,
  GraphNode,
} from './presenter';
import * as URI from 'urijs';
import { getTermFilters } from 'modules/SearchTerms/selectors';

class TermConnections extends Component<ITermConnectionsProps, {}> {
  private terms: Array<GraphNode>;
  private links: Array<GraphConnection>;

  componentWillMount() {
    this.props.setLoadingStatus(true);
  }

  shouldComponentUpdate(nextProps: ITermConnectionsStateProps) {
    return this.props.isInProgress === true && nextProps.isInProgress === false;
  }

  componentWillReceiveProps(nextProps: ITermConnectionsStateProps) {
    if (this.props.isInProgress === false && nextProps.isInProgress === true) {
      this.terms = this.props.terms;
      this.links = this.props.links;
    }
  }

  render() {
    return presenter({
      ...this.props,
      terms: this.props.isInProgress ? this.terms : this.props.terms,
      links: this.props.isInProgress ? this.links : this.props.links,
    });
  }
}

function mapStateToProps(state: Object, ownProps: Object): ITermConnectionsStateProps {
  let connections = selectors.getConnections(state);
  const isInProgress = get(state, 'searchTerms.relations.isLoading', true);
  const termFilters = getTermFilters(state);

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
      const address = new URI(paths.term(id, true));
      address.search(stateProps.termFilters);
      dispatchProps.goToAddress(address.href());
    }
  }
}

export default connect<ITermConnectionsStateProps, ITermConnectionsDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  {
    pure: true,
  }
)(TermConnections);
