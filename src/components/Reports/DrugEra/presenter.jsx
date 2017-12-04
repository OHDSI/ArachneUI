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
 * Created: November 09, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Panel,
  TabbedPane,
} from 'arachne-ui-components';
import Table from 'components/Charts/Table';
import * as d3 from 'd3';
import { chartSettings } from 'modules/DataCatalog/const';
import Chart from 'components/Reports/Chart';
import { convertDataToTreemapData } from 'components/Reports/converters';
import DrugEraDetails from './DrugEraDetails';
import ReportUtils from 'components/Reports/Utils';

require('./style.scss');

function DrugEra(props) {
  const {
    conditions,
    loadConditionDetails,
    details,
    onZoom,
    initialZoomedConcept,
    tableData,
    tableColumns,
    treemap,
  } = props;
  const classes = new BEMHelper('report-drugera');
  const dataPresent = conditions && conditions.PERCENT_PERSONS && conditions.PERCENT_PERSONS.length;
  const table = <Table
    data={tableData}
    columns={tableColumns}
    pageSize={5}
    onRowClick={node => loadConditionDetails(node.id.value)}
  />;

  return (
    <div {...classes()}>
      <div className='row'>
        <div className='col-xs-12'>
          <Chart
            title='Drug Eras'
            isDataPresent={dataPresent}
            isTreemap
            table={table}
            render={({ width, element }) => {
              const height = width/3;
              const minimum_area = 50;
              const threshold = minimum_area / (width * height);
              treemap.render(
                convertDataToTreemapData(conditions, threshold, {
                  numPersons: 'NUM_PERSONS',
                  id: 'CONCEPT_ID',
                  path: 'CONCEPT_PATH',
                  pctPersons: 'PERCENT_PERSONS',
                  recordsPerPerson: 'LENGTH_OF_ERA',
                }),
                element,
                width,
                height,
                {
                  ...chartSettings,
                  onclick: node => loadConditionDetails(node.id),
                  getsizevalue: node => node.numPersons,
                  getcolorvalue: node => node.recordsPerPerson,
                  getcontent: (node) => {
                    return ReportUtils.getTreemapTooltipContent(node, treemap, 'Prevalence:', 'Number of People:', 'Records per Person:');
                  },
                  gettitle: (node) => {
                    return ReportUtils.getTreemapTooltipTitle(node);
                  },
                  useTip: true,
                  getcolorrange: () => d3.schemeCategory20c.slice(1),
                  onZoom: onZoom,
                  initialZoomedConcept: initialZoomedConcept,
                }
              );
            }}
          />
        </div>
      </div>
      {details && <DrugEraDetails {...details} />}
    </div>
  );
}

export default DrugEra;
