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
 * Created: November 20, 2017
 *
 */

import React from 'react';
import * as d3 from 'd3';
import Chart from 'components/Reports/Chart';
import isEmpty from 'lodash/isEmpty';

function ConditionByIndexDetails(props) {
    const {
        data,
        scatterplot,
        title,
    } = props;

    return (
        <div>
            <div className='row'>
                <div className='col-xs-12'>
                    <Chart
                        title={title}
                        isDataPresent={!isEmpty(data)}
                        render={({width, element}) => {
                            const height = width / 3;
                            scatterplot.render(
                                data,
                                element,
                                width,
                                height,
                                {
                                    yFormat: d3.format('0.2%'),
                                    xValue: "duration",
                                    yValue: "pctPersons",
                                    xLabel: "Duration Relative to Index",
                                    yLabel: "% Persons",
                                    seriesName: "recordType",
                                    showLegend: true,
                                    circleRadius: 4
                                }
                            );
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default ConditionByIndexDetails;
