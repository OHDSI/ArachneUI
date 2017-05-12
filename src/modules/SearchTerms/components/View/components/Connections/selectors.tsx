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
  		if(node.parentIds && node.parentIds.length > 1) {
  			for(let i=1; i<node.parentIds.length; i++) {
  				links.push({
	  				source: node.parentIds[i],
	  				target: node.id,
	  			});
  			}
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
