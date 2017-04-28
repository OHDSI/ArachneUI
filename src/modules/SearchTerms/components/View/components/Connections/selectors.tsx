import { createSelector } from 'reselect';
import { get } from 'lodash';

const getRawConnections = (state: Object) => get(state, 'searchTerms.relations.data', {
    terms: [],
    links: [],
}) || {
    terms: [],
    links: [],
};

const getConnections = createSelector(
  getRawConnections,
  connections => connections
  );

export default {
  getConnections,
};
