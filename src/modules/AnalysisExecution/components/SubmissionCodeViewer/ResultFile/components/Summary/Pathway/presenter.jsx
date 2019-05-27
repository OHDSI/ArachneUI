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
 * Created: Apr 24, 2019
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import './style.scss';
import { sunburst } from '@ohdsi/atlascharts/dist/atlascharts.umd';
import { chartSettings } from 'modules/DataCatalog/const';
import Chart from 'components/Reports/Chart';
import { Panel, Table, TableCellText } from 'arachne-ui-components';
import * as d3 from 'd3';

function tooltipBuilder({ path }) {
  const classes = BEMHelper('summary-pathway-tooltip');
  const nameBuilder = (name, color) => `<span class="${classes('tip-name')}" style="background-color:${color}; color: ${name == 'end' ? 'black' : 'white'}">${name}</span>`;
  const stepBuilder = (step) => `<div class="${classes('tip-step')}">${step.names.map(n => nameBuilder(n.name, n.color)).join("")}</div>`;

  return `<div class="${classes('tip-container')}"">${path.map(s => stepBuilder(s)).join("")}</div>`;
}

function formatPct(val) {
  return d3.format(".1%")(val);
}

function PathNameCell({ className, mods, value }) {
  const classes = BEMHelper('pathname-cell');
  return (<span {...classes({ modifiers: mods, extra: className })} title={value}>{value}</span>);
}

export default function SummaryPathway({ className, pathways, sunburstChart, loadPathwayDetails, details }) {
  const classes = BEMHelper('summary-pathway');

  return (
    <div {...classes({ extra: className })}>
      <div {...classes('result-info')}>
        {pathways.map((pathway, i) => {
          return (
            <div {...classes()}>
              <div {...classes('padded')}>
                <Panel title={'Legend'}>
                  <div {...classes('legend-section')}>
                    <h5>Target cohort</h5>
                    <div {...classes('cohort-name')}>{pathway.targetCohortName}</div>
                    <ul {...classes('legend-props-list')}>
                      <li>Target cohort count: <span>{pathway.targetCohortCount}</span></li>
                      <li>Persons with pathways count: <span>{pathway.personsReported}</span></li>
                      <li>Persons with pathways portion: <span>{ formatPct(pathway.personsReportedPct) }</span></li>
                    </ul>
                  </div>
                  <div {...classes('legend-section')}>
                    <h5>Event cohorts</h5>
                    {pathway.eventCodes.map(ec => {
                      return (
                        <div {...classes()}>
                          <div {...classes('legend-symbol')} style={{ 'background-color': pathway.colors(ec.code) }}></div>
                          <div>{ec.name}</div>
                        </div>
                      );
                    })}
                  </div>
                </Panel>
                <Panel title={'Path details'}>
                  <div {...classes()}>
                    <Table data={ details }>
                      <PathNameCell {...classes("cell-name")} header="Name" field="names" format={names => names.map(n => n.name).join(", ")} />
                      <TableCellText header="% Remain" field="remainPct" format={pct => formatPct(pct)} />
                      <TableCellText header="% Diff" field="diffPct" format={pct => formatPct(pct)} />
                    </Table>
                  </div>
                </Panel>
              </div>
              <Chart
                  key={i}
                  title = "Sunburst plot"
                  {...classes('chart')}
                  isDataPresent={ pathways.length > 0 }
                  render = {({width, element}) => {
                    sunburstChart.render(pathway.pathway, element, width, width * 0.5,
                      {
                        minHeight: 300,
                        tipClass: 'pathway-tip',
                        tooltip: (d) => {
                          const path = pathway.tooltips(d);
                          return tooltipBuilder({ path });
                        },
                        useTip: true,
                        colors: pathway.colors,
                        onclick: (node) => { sunburstChart.destroyTipIfExists(); loadPathwayDetails({ pathway, node }); },
                        ...chartSettings,
                      });
                  }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
};