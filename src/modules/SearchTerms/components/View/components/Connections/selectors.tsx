import { createSelector } from 'reselect';
import { get } from 'lodash';
import { GraphNode, GraphConnection } from './presenter';

const getRawConnections = (state: Object) => get(state, 'searchTerms.relations.data', {
  terms: [],
  links: [],
}) || {
  terms: [],
  links: [],
};

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

export default {
  getConnections,
};
