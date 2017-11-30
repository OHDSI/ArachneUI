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
import {
  treemap,
} from '@ohdsi/atlascharts/dist/atlascharts.umd';
import * as d3 from 'd3';
import { chartSettings } from 'modules/DataCatalog/const';
import { convertDataToTreemapData } from 'components/Reports/converters';
import Chart from 'components/Reports/Chart';

function DrugByIndex(props) {
  const {
    conditions,
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
              new treemap().render(
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
                    let result = '';
                    const steps = node.path.split('||');
                    const i = steps.length - 1;
                    result += `<div class='pathleaf'>${steps[i]}</div>`;
                    result += `<div class='pathleafstat'>
                      Prevalence: ${new treemap().formatters.format_pct(node.pctPerson)}
                    </div>`;
                    result += `<div class='pathleafstat'>
                      Number of People: ${new treemap().formatters.format_comma(node.numPersons)}
                    </div>`;
                    result += `<div class='pathleafstat'>
                      Duration: ${new treemap().formatters.format_fixed(node.recordsPerPerson)}
                    </div>`;
                    return result;
                  },
                  gettitle: (node) => {
                    let title = '';
                    const steps = node.path.split('||');
                    steps.forEach((step, i) => {
                      title += ` <div class='pathstep'>${Array(i + 1).join('&nbsp;&nbsp')}${step}</div>`;
                    });
                    return title;
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

export default DrugByIndex;
