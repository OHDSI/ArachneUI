/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
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

import { createSelector } from 'reselect';
import { get } from 'lodash';
import { ITerm, ITermConnection } from './presenter';
import { GraphConnection } from '../Connections/presenter';
import { flattenDeep } from 'lodash';

const getRawConnections = (state: Object) => {
    const data = get(state, 'searchTerms.relationships.data.items', []);
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
