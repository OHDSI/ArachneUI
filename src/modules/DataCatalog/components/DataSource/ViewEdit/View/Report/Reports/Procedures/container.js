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
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: June 08, 2017
 *
 */

import { connect } from 'react-redux';
import actions from 'actions/index';
import SelectorsBuilder from './selectors';
import Procedures from './presenter';

const selectors = new SelectorsBuilder().build();

function mapStateToProps(state) {
  const reportData = selectors.getReportData(state);
  const details = selectors.getReportDetails(state);
  const tableData = selectors.getTableData(state);
  const tableColumns = {
    id: 'Id',
    atc1: 'ATC 1',
    atc3: 'ATC 3',
    atc5: 'ATC 5',
    procedureName: 'Procedure',
    personCount: 'Persons',
    prevalence: 'Prevalence',
    recordsPerPerson: 'Records',
  };

  return {
    data: reportData,
    details,
    tableData,
    tableColumns,
  };
}

const mapDispatchToProps = {
  loadDetails: params => actions.dataCatalog.reportDetails.find(params),
};

export default connect(mapStateToProps, mapDispatchToProps)(Procedures);
