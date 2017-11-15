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
 * Created: June 07, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Panel,
  TabbedPane,
} from 'arachne-ui-components';
import {
  treemap,
} from '@ohdsi/atlascharts/dist/atlascharts.umd';
import Table from 'components/Charts/Table';
import * as d3 from 'd3';
import { chartSettings } from 'const/reports';
import get from 'lodash/get';
import ConditionDetails from './ConditionDetails';

require('./style.scss');

function Conditions(props) {
  const {
    conditions,
    loadConditionDetails,
    details,
    onZoom,
    initialZoomedConcept,
    tableData,
    tableColumns,
  } = props;
  const classes = new BEMHelper('report-conditions');
  const emptyClasses = new BEMHelper('report-empty');
  const sections = [
    {
      label: 'treemap',
      content: <div ref={(element) => {
        if (element) {
          const dimensions = element.getBoundingClientRect();
          const width = dimensions.width;
          const height = width/3;
          const minimum_area = 50;
          const threshold = minimum_area / (width * height);
          new treemap().render(
            treemap.buildHierarchyFromJSON(conditions, threshold, (name, index, data) => ({
              name,
              num_persons: get(data, `NUM_PERSONS[${index}]`),
              id: get(data, `CONCEPT_ID[${index}]`),
              path: get(data, `CONCEPT_PATH[${index}]`),
              pct_persons: get(data, `PERCENT_PERSONS[${index}]`),
              records_per_person: get(data, `RECORDS_PER_PERSON[${index}]`),
            })),
            element,
            width,
            height,
            {
              ...chartSettings,
              onclick: node => loadConditionDetails(node.id),
              getsizevalue: node => node.num_persons,
              getcolorvalue: node => node.records_per_person,
              getcontent: (node) => {
                let result = '';
                const steps = node.path.split('||');
                const i = steps.length - 1;
                result += `<div class='pathleaf'>${steps[i]}</div>`;
                result += `<div class='pathleafstat'>
                  Prevalence: ${new treemap().formatters.format_pct(node.pct_persons)}
                </div>`;
                result += `<div class='pathleafstat'>
                  Number of People: ${new treemap().formatters.format_comma(node.num_persons)}
                </div>`;
                result += `<div class='pathleafstat'>
                  Records per Person: ${new treemap().formatters.format_fixed(node.records_per_person)}
                </div>`;
                return result;
              },
              gettitle: (node) => {
                let title = ''
                const steps = node.path.split('||');
                steps.forEach((step, i) => {
                  title += ` <div class='pathstep'>${Array(i + 1).join('&nbsp;&nbsp')}${step}</div>`;
                });
                return title;
              },
              useTip: true,
              getcolorrange: () => d3.schemeCategory20c.slice(1),
              onZoom: onZoom,
              initialZoomedConcept: initialZoomedConcept,
            }
          )
        }
      }}
      >
        <div className='treemap_zoomtarget'></div>
      </div>
    },
    {
      label: 'Table',
      content: <Table
        data={tableData}
        columns={tableColumns}
        pageSize={5}
        onRowClick={node => loadConditionDetails(node.id.value)}
      />,
    },
  ];
  const dataPresent = conditions && conditions.PERCENT_PERSONS && conditions.PERCENT_PERSONS.length;

  return (
    <div {...classes()}>
      <div className='row'>
        <div className='col-xs-12'>
          <Panel title='Condition Prevalence' {...classes('chart')}>
            {dataPresent
              ? <TabbedPane sections={sections} />
              : <div {...emptyClasses()}>
                  <span {...emptyClasses('text')}>No data</span>
                </div>
            }
          </Panel>
        </div>
      </div>
      {details && <ConditionDetails {...details} />}
    </div>
  );
}

export default Conditions;
