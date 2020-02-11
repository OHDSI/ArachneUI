/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Alexandr Saltykov, Pavel Grafkin, Vitaly Koulakov, Anton Gackovka
 * Created: March 3, 2017
 *
 */

import {connect} from 'react-redux';
import {Component} from 'react';
import actions from 'modules/SearchTerms/actions';
import {goBack, push} from 'react-router-redux';
import {get, isEqual} from 'lodash';
import {paths} from 'modules/SearchTerms/const';
import {paths as vocabularyPaths} from 'modules/Vocabulary/const';
import presenter, {ITermDispatchProps, ITermProps, ITermStateProps,} from './presenter';
import {getTermFilters} from 'modules/SearchTerms/selectors';
import * as URI from 'urijs';
import hasAnyConnections from './selectors';

interface ITermRoute {
  routeParams: {
    termId: string;
    displayMode?: string;
  };
}

class Term extends Component<ITermProps, { isFullscreen: boolean }> {
  constructor() {
    super();
    this.state = {
      isFullscreen: false,
    };
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
  }

  componentWillMount() {
    this.props.fetch(this.props.termId);
    this.props.fetchConceptAnyRelations(this.props.termId);
    if (!this.props.isTableMode) {
      this.props.fetchConceptAncestors(
          this.props.termId,
          this.props.termFilters.levels,
          this.props.termFilters.zoomLevel
      );
    }
    this.props.fetchRelationships(this.props.termId, this.props.termFilters.standardsOnly);

  }

  componentWillReceiveProps(props: ITermProps) {
    if (this.props.termId !== props.termId) {
      this.props.fetch(props.termId);
      this.props.fetchRelationships(props.termId, this.props.termFilters.standardsOnly);
      this.props.fetchConceptAnyRelations(this.props.termId);
    } else if (
        !isEqual(this.props.termFilters.levels, props.termFilters.levels)
        || !isEqual(this.props.termFilters.zoomLevel, props.termFilters.zoomLevel)) {
      this.props.fetchConceptAncestors(
          props.termId,
          props.termFilters.levels,
          props.termFilters.zoomLevel
      );
    }
  }

  toggleFullscreen() {
    this.setState({
      isFullscreen: !this.state.isFullscreen,
    });
  }

  shouldComponentUpdate(nextProps: ITermStateProps, nextState) {
    return (this.props.isLoading !== nextProps.isLoading)
      || (this.props.isTableMode !== nextProps.isTableMode)
      || (this.state.isFullscreen !== nextState.isFullscreen);
  }

  render() {
    return presenter({
      ...this.props,
      isFullscreen: this.state.isFullscreen,
      toggleFullscreen: this.toggleFullscreen,
    });
  }
}

function mapStateToProps(state: Object, ownProps: ITermRoute): ITermStateProps {
  const isLoadingTerm = get(state, 'searchTerms.terms.isLoading', false);
  const isLoadingRelations = get(state, 'searchTerms.relations.isLoading', false);
  const isLoadingRelationships = get(state, 'searchTerms.relationships.isLoading', false);
  const isLoading = isLoadingTerm || isLoadingRelations || isLoadingRelationships;
  const termId = parseInt(ownProps.routeParams.termId, 0);
  const name = get(state, 'searchTerms.terms.data.name', 'Term');
  const details = get(state, 'searchTerms.terms.data', {});
  const isStandard = get(details, 'standardConcept') === 'Standard';
  const hasConnections = !!hasAnyConnections(state);
  const isTableMode = ownProps.routeParams.displayMode !== 'graph' || !hasConnections;
  const termFilters = getTermFilters(state);
  const termConnections = isTableMode ? get(state, 'searchTerms.relationships.data.count', 0) : get(state, 'searchTerms.relations.data.connectionsCount', 0)


  return {
    details,
    isLoading,
    name,
    termId,
    isTableMode,
    isStandard,
    termFilters,
    termConnections,
    hasConnections,
  };
}

const mapDispatchToProps = {
  fetch: actions.termList.fetch,
  fetchConceptAncestors: actions.termList.fetchConceptAncestors,
  goBack,
  fetchRelationships: actions.termList.fetchRelationships,
  fetchConceptAnyRelations: actions.termList.fetchConceptAnyRelations,
  redirect: address => push(address),
};

function mergeProps(
  stateProps: ITermStateProps,
  dispatchProps: ITermDispatchProps,
  ownProps: ITermRoute,
 ): ITermProps {
   // @ts-ignore
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    changeTab: (tab) => {
      const address = new URI(paths.term(stateProps.details.id, tab === 'graph'));
      address.search({
        fullscreen: stateProps.isFullscreen ? 'true' : 'false',
        ...stateProps.termFilters
      });
      return dispatchProps.redirect(address.href());
    },
    goToLicenses(vocabularyIds: Array<string>) {
      const url = new URI(vocabularyPaths.vocabsList());
      url.setSearch({
        request: vocabularyIds,
      });

      dispatchProps.redirect(url.href());
    },
  };
}

export default connect<ITermStateProps, ITermDispatchProps, {}>(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  {
    pure: false,
  }
)(Term);
