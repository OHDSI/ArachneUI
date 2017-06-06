import { createSelector } from 'reselect';
import { get, has } from 'lodash';
import { GraphNode, GraphConnection } from './presenter';
import { defaultLevels, defaultStandardsOnly } from 'modules/SearchTerms/const';

const getRawConnections = (state: Object) => get(state, 'searchTerms.relations.data', {
  terms: [],
  links: [],
}) || {
  terms: [],
  links: [],
};

const getRawLocation = (state: Object) => get(state, 'routing.locationBeforeTransitions', {
  pathname: '',
  query: null,
});

const getConnections = createSelector(
  getRawConnections,
  connections => {
    const levels = {};
    // count how much terms are placed on each level
    connections.terms.forEach((concept) => {
      if (levels[concept.depth] === undefined) {
        levels[concept.depth] = {
          current: 0,
          total: 1
        };
      } else {
        levels[concept.depth].total += 1;
      }
    });
    // define depth for y coordinate (0 in the center, negative values above, positive values below it, like x-depth)
    connections.terms = connections.terms.map((concept) => ({
      ...concept,
      yDepth: (levels[concept.depth].current++) - levels[concept.depth].total/2,
    }));

    return connections;
  }//connections
  );

const getTermFilters = createSelector(
  getRawLocation,
  location => {
    return {
      levels: has(location.query, 'levels') ? location.query.levels : defaultLevels,
      standardsOnly: has(location.query, 'standardsOnly') ? location.query.standardsOnly === 'true' : defaultStandardsOnly,
    };
  }
);

export default {
  getConnections,
  getTermFilters,
};
