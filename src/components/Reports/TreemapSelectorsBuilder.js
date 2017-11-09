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

// @ts-check
import { createSelector } from 'reselect';
import get from 'lodash/get';
import treemapDataConverter from 'components/Reports/treemapDataConverter';

export default class TreemapSelectorsBuilder {
  getReportData(state) {
    const reportData = get(state, 'dataCatalog.report.data.result', {});
    return treemapDataConverter(reportData);
  };

  getRawTableData(state) {
    return get(state, 'dataCatalog.report.data.result') || [];
  }

  getRawDetails(state) {
    return get(state, 'dataCatalog.reportDetails.data.result');
  }

  extractTableData(rawTableData) {
    return [];
  }

  extractReportDetails(rawReportDetails) {
    return {};
  }

  buildSelectorForTableData() {
    return createSelector(
      this.getRawTableData,
      this.extractTableData
    );
  }

  buildSelectorForReportDetails() {
    return createSelector(
      this.getRawDetails,
      this.extractReportDetails
    );
  }

  build() {
    return {
      getReportData: this.getReportData,
      getTableData: this.buildSelectorForTableData(),
      getReportDetails: this.buildSelectorForReportDetails(),
    };
  }
}
