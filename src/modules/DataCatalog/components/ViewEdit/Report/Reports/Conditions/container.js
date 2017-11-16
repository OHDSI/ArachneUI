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

import TreemapReportBuilder from 'components/Reports/TreemapReport';
import { connect } from 'react-redux';
import actions from 'actions/index';
import SelectorsBuilder from './selectors';
import presenter from './presenter';

const selectors = new SelectorsBuilder().build();

export default class Conditions extends TreemapReportBuilder {
  constructor() {
    super();
    this.presenter = presenter;
    this.filePath = 'conditions';
  }

  getFilename(conceptId) {
    return `condition_${conceptId}.json`;
  }
  
  mapStateToProps(state) {
    const reportData = selectors.getReportData(state);
    const details = selectors.getReportDetails(state);
    const tableData = selectors.getTableData(state);
    const tableColumns = {
      id: 'Id',
      soc: 'SOC',
      hlt: 'HLT',
      hlgt: 'HLGT',
      pt: 'PT',
      snomed: 'SNOMED',
      personCount: 'Persons',
      prevalence: 'Prevalence',
      recordsPerPerson: 'Records',
    };

    return {
      conditions: reportData,
      details,
      tableData,
      tableColumns,
    };
  }

  getMapDispatchToProps() {
    return {
      loadDetails: params => actions.dataCatalog.reportDetails.find(params),
    };
  }

}

