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
  Panel,
} from 'arachne-ui-components';
import * as d3 from 'd3';
import { chartSettings } from 'modules/DataCatalog/const';
import { convertDataToTreemapData } from 'components/Reports/converters';
import Chart from 'components/Reports/Chart';
import ReportUtils from 'components/Reports/Utils';

function ProceduresByIndex(props) {
  const {
    conditions,
    treemap,
  } = props;

  return (
    <div>
      <div className='row'>
        <div className='col-xs-12'>
          <Chart
            title='Procedures'
            isDataPresent={conditions}
            render={({ width, element }) => {
              const height = width/3;
              const minimum_area = 50;
              const threshold = minimum_area / (width * height);
              treemap.render(
                convertDataToTreemapData(conditions, threshold, {
                  numPersons: 'COUNT_VALUE',
                  id: 'CONCEPT_ID',
                  path: 'CONCEPT_NAME',
                  pctPersons: 'PCT_PERSONS',
                  recordsPerPerson: 'DURATION',
                }),
                element,
                width,
                height,
                {
                  ...chartSettings,
                  onclick: () => {},
                  getsizevalue: node => node.numPersons,
                  getcolorvalue: node => node.recordsPerPerson,
                  getcontent: (node) => {
                    return ReportUtils.getTreemapTooltipContent(node, treemap, 'Prevalence:', 'Number of People:', 'Duration:');
                  },
                  gettitle: (node) => {
                    return ReportUtils.getTreemapTooltipTitle(node);
                  },
                  useTip: true,
                  getcolorrange: () => d3.schemeCategory20c.slice(1),
                  onZoom: () => {},
                  initialZoomedConcept: null,
                }
              )
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ProceduresByIndex;
