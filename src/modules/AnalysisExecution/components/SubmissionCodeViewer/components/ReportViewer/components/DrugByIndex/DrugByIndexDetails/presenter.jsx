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
 * Created: November 20, 2017
 *
 */

import React from 'react';
import {
  line,
} from '@ohdsi/atlascharts/dist/atlascharts.umd';
import * as d3 from 'd3';
import { chartSettings } from 'modules/DataCatalog/const';
import Chart from 'components/Reports/Chart';

function DrugByIndex(props) {
  const {
    data,
  } = props;

  return (
    <div>
      <div className='row'>
        <div className='col-xs-12'>
          <Chart
            title='Drugs by index'
            isDataPresent={data}
            render={({ width, element }) => {
              const height = width/3;
              const minimum_area = 50;
              const threshold = minimum_area / (width * height);
              new line().render(
                data,
                element,
                width,
                height,
                {
                  yLabel: 'Count',
                  xLabel: 'Duration',
                  xScale: d3.scaleTime().domain(
                    d3.extent(data[0].values, d => d.xValue)
                  ),
                  showLegend: false,
                  colors: d3.scaleOrdinal()
                    .range(d3.schemeCategory10),
                  ...chartSettings,
                }
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default DrugByIndex;
