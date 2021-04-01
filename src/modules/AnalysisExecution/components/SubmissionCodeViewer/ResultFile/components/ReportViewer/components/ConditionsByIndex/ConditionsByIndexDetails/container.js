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
 * Authors: Alexander Saltykov
 * Created: November 20, 2017
 *
 */

import { get } from 'services/Utils';
import TreemapReport from 'components/Reports/TreemapReport';
import { convertDataToScatterplotData } from 'components/Reports/converters';
import ConditionByIndexDetails from './presenter';

export default class ConditionByIndexDetailsBuilder extends TreemapReport {
    constructor() {
        super();
        this.presenter = ConditionByIndexDetails;
    }

    mapStateToProps(state, ownProps) {
        const conditions = get(ownProps, 'conditions', null);
        const title = get(conditions, 'CONCEPT_NAME', [''])[0];

        return {
            data: conditions
                ? convertDataToScatterplotData(conditions)
                : null,
            title,
        };
    }

}
