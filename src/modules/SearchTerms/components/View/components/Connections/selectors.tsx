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
