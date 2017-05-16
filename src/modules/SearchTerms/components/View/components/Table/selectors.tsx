import { createSelector } from 'reselect';
import { get } from 'lodash';
import { ITerm, ITermConnection } from './presenter';
import { GraphConnection } from '../Connections/presenter';

const getRawConnections = (state: Object) => get(state, 'searchTerms.relations.data', {
  terms: [],
  links: [],
}) || {
  terms: [],
  links: [],
};

const getConnections = createSelector(
  getRawConnections,
  (connections) => {
    const terms = {};
    connections.terms.forEach((term: ITerm) => {
      terms[term.id] = term;
    });
    return connections.links.map((link: GraphConnection) => ({
      source: terms[link.source],
      target: terms[link.target],
    }));
  }
  );

export default {
  getConnections,
};
