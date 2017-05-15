import { createSelector } from 'reselect';
import { get } from 'lodash';
import { GraphNode, GraphConnection } from './presenter';

const getRawConnections = (state: Object) => get(state, 'searchTerms.relations.data', []) || [];

const getConnections = createSelector(
  getRawConnections,
  (connections) => {
  	const terms = connections;
  	const links: Array<GraphConnection> = [];
  	terms.forEach((node: GraphNode) => {
  		if(node.parentIds && node.parentIds.length > 0) {
  			node.parentIds.forEach(id => {
          links.push({
            source: id,
            target: node.id,
          });
        });
      }
  	});

  	return {
  		terms,
  		links,
  	};
  }
  );

export default {
  getConnections,
};
