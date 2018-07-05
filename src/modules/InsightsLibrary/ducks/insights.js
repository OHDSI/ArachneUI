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
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: July 19, 2017
 *
 */

import Duck from 'services/Duck';
import { apiPaths } from 'modules/InsightsLibrary/const';
import { Utils } from 'services/Utils';

const actionCoreName = 'IL_INSIGHTS';

const insightsDuck = new Duck({
	name: actionCoreName,
	urlBuilder: apiPaths.insights,
});

const actions = insightsDuck.actions;
const reducer = insightsDuck.reducer;

function saveFilter(filter) {
	localStorage.setItem('insights-filter', JSON.stringify(filter));
}

function getSavedFilter() {
  return Utils.getFilterFromLS('insights-filter');
}

function dropFilter() {
  localStorage.removeItem('insights-filter');
}

export default {
	actions,
	reducer,
};
export {
	saveFilter,
	getSavedFilter,
	dropFilter,
}
