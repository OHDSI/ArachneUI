/*
 *
 * Copyright 2020 Odysseus Data Services, inc.
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
 * Authors: Alex Cumarav
 * Created: March 30, 2020
 *
 */


import * as React from 'react';
import BEMHelper from "services/BemHelper";

import { Downloads, Filters } from './components';
import { SortingParams } from "../../actions/statistics";
import { IStatisticsFilter } from "./components/Filters/presenter";

require('./style.scss');

interface IStatisticsProps extends IStatisticsStateProps, IStatisticsDispatchProps {

    runSearch: Function

}

interface IStatisticsStateProps {
    sorting: SortingParams,
    filter: IStatisticsFilter

}

interface IStatisticsDispatchProps {
    loadStatistics: Function
}

function Statistics(props: IStatisticsProps) {
    const classes = BEMHelper('statistics');

    return (
        <div {...classes()}>
            <div {...classes({element: 'content'})}>
                <div {...classes({element: 'filters-wrapper'})}>
                    <Filters runSearch={props.runSearch}/>
                </div>
                <div {...classes({element: 'downloads-wrapper'})}>
                    <Downloads runSearch={props.runSearch}/>
                </div>
            </div>
        </div>);
}

export default Statistics;

export { IStatisticsProps, IStatisticsStateProps, IStatisticsDispatchProps }