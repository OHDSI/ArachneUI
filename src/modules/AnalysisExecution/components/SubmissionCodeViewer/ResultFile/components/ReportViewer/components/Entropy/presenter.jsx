/*
 *
 * Copyright 2018 Observational Health Data Sciences and Informatics
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

import React from 'react';
import BEMHelper from 'services/BemHelper';
import Chart from 'components/Reports/Chart';
import * as d3 from 'd3';
import { numberFormatter } from 'services/Utils';
import { chartSettings } from 'const/reports';
import isEmpty from 'lodash/isEmpty';
import {
  line,
} from '@ohdsi/atlascharts';

import './style.scss';

function Entropy(props) {
  const classes = new BEMHelper('report-entropy');
  const {
    data,
		lineChart,
  } = props;

  return (
    <div {...classes()}>
      <Chart
        title='Entropy'
        isDataPresent={!isEmpty(data)}
        render={({ width, element }) => {
					lineChart.render(
            data,
            element,
            width, // Scrollbar width
            width / 4,
            {
              yLabel: 'Entropy',
              xLabel: 'Date',
              xFormat: d3.timeFormat('%m/%Y'),
              yFormat: d => numberFormatter.format(d, 'short'),
              xScale: d3.scaleTime().domain(
                d3.extent(data[0].values, d => d.xValue)
              ),
              tickFormat: d3.timeFormat('%m/%Y'),
              showLegend: false,
              colors: d3.scaleOrdinal()
                .range(d3.schemeCategory10),
              ...chartSettings,
            }
          );
        }}
      />
    </div>
  );
}

Entropy.propTypes = {
};

export default Entropy;