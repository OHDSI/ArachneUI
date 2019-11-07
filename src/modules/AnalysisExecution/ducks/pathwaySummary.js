/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
 * Authors: Vitaly Koulakov
 * Created: May 24, 2019
 *
 */

import Duck from 'services/Duck';
import { get } from 'services/Utils';
import cloneDeep from 'lodash/cloneDeep';
import { apiPaths, fileTypes } from 'modules/AnalysisExecution/const';
import ReducerFactory from 'services/ReducerFactory';
import { action as actionName } from 'services/CrudActionNameBuilder';

const coreName = 'AE_PATHWAY_SUMMARY';

class PathwaySummaryDuckBuilder {
	constructor() {
		this.reducerFactory = new ReducerFactory();

		this.actions = {
			GET_DETAILS: `${coreName}_GET_DETAILS`,
		};

		this.duck = new Duck({
			name: coreName,
			urlBuilder: () => null,
		});
	}

	getGetDetailsAction() {
		return ({ pathway, node }) => {
			const path = pathway.getPathToNode(node);

			const rowBuilder = (path, i ,allPaths) => ({
				names: path.names,
				personCount: path.count,
				remainPct: path.count / pathway.summary.totalPathways
			});

			let rows = path.map(rowBuilder);
			rows.forEach((r, i) => {
				if (i > 0) {
					r.diffPct = rows[i-1].remainPct - r.remainPct;
				} else {
					r.diffPct = 1.0 - r.remainPct;
				}
			});

			return ({
				type: this.actions.GET_DETAILS,
				payload: {
					details: rows,
				}
			})
		};
	}

	buildReducer() {
		return this.reducerFactory
			.setActionHandlers([
					{
						action: this.actions.GET_DETAILS,
						handler: (state, { payload: { details } }) => {
							return ({
								...state,
								details,
							});
						}
					}
				])
			.build();
	}

	build() {
		return {
			actions: {
				getDetails: this.getGetDetailsAction(),
			},
			reducer: this.buildReducer(),
		}
	}
}

const builder = new PathwaySummaryDuckBuilder();

export default builder.build();