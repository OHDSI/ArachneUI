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
 * Authors: Alexander Saltykov
 * Created: November 13, 2017
 *
 */

import * as d3 from 'd3';
import { chart } from '@ohdsi/atlascharts/dist/atlascharts.umd';
import ReportUtils from 'components/Reports/Utils';

export default (rawData, DTO = {
  xValue: 'X_CALENDAR_YEAR',
  trellisName: 'TRELLIS_NAME',
  seriesName: 'SERIES_NAME',
}) => {

  let data = [];
  let trellisSet = [];

  if (rawData[DTO.xValue]) {
    const minXValue = d3.min(rawData[DTO.xValue]);
    const maxXValue = d3.max(rawData[DTO.xValue]);
  
    const nestByDecile = d3.nest()
      .key(d => d[DTO.trellisName])
      .key(d => d[DTO.seriesName])
      .sortValues((a, b) =>
        a[DTO.xValue] - b[DTO.xValue]
      );
  
    // map rawData into chartable form
    const normalizedSeries = chart.dataframeToArray(rawData);
    data = nestByDecile.entries(normalizedSeries);
    // fill in gaps
    const xValuesRange = d3.range(minXValue, maxXValue, 1);
  
    data.forEach((trellis) => {
      trellis.values.forEach((series) => {
        series.values = xValuesRange.map((year) => { // eslint-disable-line no-param-reassign
          const xValue = series.values.filter(
            f => f[DTO.xValue] == year // eslint-disable-line eqeqeq
          )[0] || ReportUtils.seriesInitializer(trellis.key, series.key, year, 0);
          xValue.date = new Date(year, 0, 1);
          return xValue;
        });
      });
    });
  
    data = Array.isArray(data)
      ? data
      : [data];
  
    trellisSet = data.map(series => series.key);
  }

  return {
    data,
    trellisSet,
  };
};

