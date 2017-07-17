import { connect } from 'react-redux';
import { Component } from 'react';
import actions from 'modules/SearchTerms/actions';
import { goBack, push } from 'react-router-redux';
import { get, has } from 'lodash';
import { paths } from 'modules/SearchTerms/const';
import {
  ITermProps,
  ITermStateProps,
  ITermDispatchProps,
} from './presenter';
import { getTermFilters } from 'modules/SearchTerms/selectors';
import * as URI from 'urijs';
import presenter from './presenter';

interface ITermRoute {
  routeParams: {
    termId: string;
    displayMode?: string;
  };
}

class Term extends Component<ITermProps, {}> {
  componentWillMount() {
    this.props.fetch(this.props.termId);
    this.props.fetchConceptAncestors(this.props.termId, this.props.termFilters.levels);
    this.props.fetchRelationships(this.props.termId, this.props.termFilters.standardsOnly);
  }

  componentWillReceiveProps(props: ITermProps) {
    if (this.props.termId !== props.termId) {
      this.props.fetch(props.termId);
      this.props.fetchRelationships(props.termId, this.props.termFilters.standardsOnly);
      this.props.fetchConceptAncestors(props.termId, this.props.termFilters.levels);
    } else if (this.props.termFilters.levels !== props.termFilters.levels) {
      this.props.fetchConceptAncestors(props.termId, props.termFilters.levels);
    }
  }

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state: Object, ownProps: ITermRoute): ITermStateProps {
  const isLoading = get(state, 'searchTerms.terms.isLoading', false);
  const termId = parseInt(ownProps.routeParams.termId, 0);
  const name = get(state, 'searchTerms.terms.data.name', 'Term');
  const details = get(state, 'searchTerms.terms.data', {});
  const isStandard = get(details, 'standardConcept') === 'Standard';
  const relationships = get(state, 'searchTerms.relationships.data', []) || [];
  const connectionsCount = get(state, 'searchTerms.relations.data.connectionsCount', 0);
  const isTableMode = ownProps.routeParams.displayMode === 'table' || !connectionsCount;
  const termFilters = getTermFilters(state);

  return {
    details,
    isLoading,
    name,
    termId,
    isTableMode,
    isStandard,
    termFilters,
    connectionsCount,
    relationshipsCount: isTableMode ? relationships.length : connectionsCount,
  };
}

const mapDispatchToProps = {
  fetch: actions.termList.fetch,
  fetchConceptAncestors: actions.termList.fetchConceptAncestors,
  goBack,
  fetchRelationships: actions.termList.fetchRelationships,
  redirect: address => push(address),
};

function mergeProps(
  stateProps: ITermStateProps,
  dispatchProps: ITermDispatchProps,
  ownProps: ITermRoute,
 ): ITermProps {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    changeTab: (tab) => {
      const address = new URI(paths.term(stateProps.details.id, tab === 'table'));
      address.search(stateProps.termFilters);
      return dispatchProps.redirect(address.href());
    },
  };
}

export default connect<ITermStateProps, ITermDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(Term);
