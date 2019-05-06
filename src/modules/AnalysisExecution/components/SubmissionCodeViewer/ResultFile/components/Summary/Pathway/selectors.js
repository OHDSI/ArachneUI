/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: May 6, 2019
 *
 */

import { get } from 'services/Utils';
import { createSelector } from 'reselect';
import { util } from '@ohdsi/atlascharts/dist/atlascharts.umd';

class PathwaySummarySelectorsBuilder {

	buildHierarchy(pathways) {
		util.buildHierarchy(pathways, d => d.path, d => d.personCount);
	}

	sumChildren(node) {
		return node.children ? node.children.reduce((r, n) => r + this.sumChildren(n),0) : node.size;
	}

	summarizeHierarchy(pathway) {
		return { totalPathways: this.sumChildren(pathway) };
	}

	getRawPathwayGroups(state) {
		return get(state, 'resultInfo.pathwayGroups', [], 'Array');
	}

	buildSelectorForPathways() {
		return createSelector([this.getRawPathwayGroups], pathwayGroups => pathwayGroups.map(pathwayGroup => {
			const pathway = this.buildHierarchy(pathwayGroup.pathways);
			const targetCohort = {};
			const summary = {...this.summarizeHierarchy(pathway), cohortPersons: pathwayGroup.targetCohortCount, pathwayPersons: pathwayGroup.totalPathwaysCount};
			return {
				pathway,
				targetCohortName: targetCohort.name,
				targetCohortCount: summary.cohortPersons,
				personsReported: summary.pathwayPersons,
				personsReportedPct: summary.pathwayPersons / summary.cohortPersons,
			};
		}));
	}

	getEventCohorts() {

	}

  build() {
    return {
    	getPathways: this.buildSelectorForPathways(), 
    };
  }
}

export default PathwaySummarySelectorsBuilder;
