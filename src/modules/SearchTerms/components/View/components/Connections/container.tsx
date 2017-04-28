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
  connections = {
    terms: [],
    links: [],
  };

  // mock data
  const n = parseInt(get(state, 'routing.locationBeforeTransitions.query.n', 1));
  for(let i=0; i<n; i++) {
    connections.terms.push({
      id: i,
      name: `Concept ${i}`,
    });
  }
  for(let i=1; i<n/2; i++) {
    connections.terms[i].parent = 0;
  }
  for(let i=n/2-1; i<n; i++) {
    connections.terms[i].parent = i%3 === 0 ? i-3 : (i%2 === 0 ? i-1 : i-2);
  }
  try {
    connections.terms[5].parent = 3;
    connections.terms[10].parent = 5;
  } catch(er) {}

  return {
    terms: connections.terms, 
    links: connections.links,
  };
}

const mapDispatchToProps = {
  goToTerm: (id: number) => goToPage(paths.term(id)+`?n=${id * 2}`),
};

export default connect<ITermConnectionsStateProps, ITermConnectionsDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps
)(TermConnections);
