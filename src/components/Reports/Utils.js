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
 * Created: November 09, 2017
 *
 */

import * as d3 from 'd3';
import moment from 'moment';
import { chart } from '@ohdsi/atlascharts';
import { typeCheck } from 'type-check';
import cloneDeep from 'lodash/cloneDeep';
import { get } from 'services/Utils';
import { reports } from 'const/reports';

export default class ReportUtils {
  static prepareLineData(rawData) {
    const data = cloneDeep(rawData);
    let normalizedData = {
      X_CALENDAR_MONTH: [],
    };
    let transformedData;
    if (rawData) {
      data.X_CALENDAR_MONTH.forEach((d, i, ar) => {
        ar[i] = moment(d, 'YYYYMM').valueOf(); // eslint-disable-line no-param-reassign
      });
      normalizedData = chart.dataframeToArray(data);
          // nest dataframe data into key->values pair
      transformedData = d3.nest()
              .key(d => d.SERIES_NAME)
              .entries(normalizedData)
              .map(d => ({ name: d.key, values: d.values }));
    }
    return {
      normalizedData,
      transformedData,
    };
  }

  static seriesInitializer(tName, sName, x, y) {
    return {
      TRELLIS_NAME: tName,
      SERIES_NAME: sName,
      X_CALENDAR_YEAR: x,
      Y_PREVALENCE_1000PP: y,
    };
  }

  static prepareChartDataForDonut(rawData = { CONCEPT_ID: [], COUNT_VALUE: [], CONCEPT_NAME: [] }) {
    const values = Array.isArray(rawData.COUNT_VALUE) ? rawData.COUNT_VALUE : [rawData.COUNT_VALUE];
    const legend = Array.isArray(rawData.CONCEPT_NAME) ? rawData.CONCEPT_NAME : [rawData.CONCEPT_NAME];
    const ids = Array.isArray(rawData.CONCEPT_ID) ? rawData.CONCEPT_ID : [rawData.CONCEPT_ID];
    return values.map((value, i) => ({
      value,
      label: legend[i],
      id: ids[i],
    }));
  }

  static arrayToDataframe(ar) {
    const keys = Object.keys(get(ar, '[0]', {}));
    const dataframe = {};
    keys.forEach((key) => {
      dataframe[key] = [];
    });
    ar.forEach((dto) => {
      keys.forEach((key) => {
        dataframe[key].push(dto[key]);
      });
    });

    return dataframe;
  }

  static getReportType(docType) {
    return reports[docType]
      ? docType
      : reports.unknown;
  }

  static getTreemapTooltipContent({ node, treemap, label1, label2, label3 }) {
    let result = '';
    const steps = node.path.split('||');
    const i = steps.length - 1;
    result += `<div class='pathleaf'>${steps[i]}</div>`;
    result += `<div class='pathleafstat'>
                    ${label1} ${treemap.formatters.format_pct(node.pctPersons)}
                  </div>`;
    result += `<div class='pathleafstat'>
                    ${label2} ${treemap.formatters.format_comma(node.numPersons)}
                  </div>`;
    result += `<div class='pathleafstat'>
                    ${label3} ${treemap.formatters.format_fixed(node.recordsPerPerson)}
                  </div>`;
    return result;
  }

  static getTreemapTooltipTitle(node) {
    let title = '';
    const steps = node.path.split('||');
    steps.forEach((step, i) => {
      title += ` <div class='pathstep'>${Array(i + 1).join('&nbsp;&nbsp')}${step}</div>`;
    });
    return title;
  }
}
