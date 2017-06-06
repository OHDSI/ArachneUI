import { connect } from 'react-redux';
import { Component } from 'react';
import actions from 'modules/SearchTerms/actions';
import { goBack } from 'react-router-redux';
import { get, has } from 'lodash';
import presenter from './presenter';
import {
  ITermProps,
  ITermStateProps,
  ITermDispatchProps,
} from './presenter';

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
    }
    if (this.props.termFilters.levels !== props.termFilters.levels) {
      this.props.fetchConceptAncestors(props.termId, props.termFilters.levels);
    }
    if (this.props.termFilters.standardsOnly !== props.termFilters.standardsOnly) {
      this.props.fetchRelationships(props.termId, props.termFilters.standardsOnly);
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
  const isTableMode = ownProps.routeParams.displayMode === 'table';
  const isStandard = get(details, 'standardConcept') === 'Standard';
  const relationships = get(state, 'searchTerms.relationships.data', []) || [];
  const location = get(state, 'routing.locationBeforeTransitions', {
    pathname: '',
    query: null,
  });
  const termFilters = {
    levels: has(location.query, 'levels') ? location.query.levels : 10,
    standardsOnly: has(location.query, 'standardsOnly') ? location.query.standardsOnly === 'true' : false,
  };

  return {
    details,
    isLoading,
    name,
    termId,
    isTableMode,
    isStandard,
    termFilters,
    relationshipsCount: relationships.length,
  };
}

const mapDispatchToProps = {
  fetch: actions.termList.fetch,
  fetchConceptAncestors: actions.termList.fetchConceptAncestors,
  goBack,
  fetchRelationships: actions.termList.fetchRelationships,
};

export default connect<ITermStateProps, ITermDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps
)(Term);
