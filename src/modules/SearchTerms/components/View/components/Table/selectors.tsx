import { createSelector } from 'reselect';
import { get } from 'lodash';
import { ITerm, ITermConnection } from './presenter';
import { GraphConnection } from '../Connections/presenter';
import { flattenDeep } from 'lodash';

const getRawConnections = (state: Object) => {
    const data = get(state, 'searchTerms.relationships.data', []);
    if (data instanceof Array) {
        return data;
    } else {
        return [];
    }
}

const getConnections = createSelector(
  getRawConnections,
  connections => flattenDeep(connections.map(concept =>
    concept.relationships.map((rel, i) => ({
        relationshipName: i === 0 ? concept.relationshipName : null,
        targetConcept: {
          id: rel.targetConceptId,
          name: rel.targetConceptName,
        },
        targetConceptVoc: rel.targetVocabularyId,
      }))
    )
  )
  );

export default {
  getConnections,
};
