import { createSelector } from 'reselect';
import { get } from 'lodash';
import { ITerm, ITermConnection } from './presenter';
import { GraphConnection } from '../Connections/presenter';

const getRawConnections = (state: Object) => get(state, 'searchTerms.relationships.data', []) || [];

const getConnections = createSelector(
  getRawConnections,
  connections => connections.map(concept => ({
    ...concept,
    targetConcept: {
      id: concept.targetConceptId,
      name: concept.targetConceptName,
    },
  }))
  );

export default {
  getConnections,
};
