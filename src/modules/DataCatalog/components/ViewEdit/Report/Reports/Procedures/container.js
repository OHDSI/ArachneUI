/**
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
 * Created: June 08, 2017
 *
 */

import { Component } from 'react';
import { connect } from 'react-redux';
import actions from 'actions/index';
import get from 'lodash/get';
import selectors from './selectors';
import presenter from './presenter';

class Procedures extends Component {
  constructor() {
    super();
    this.initialZoomedConcept = null;
    this.onZoom = this.onZoom.bind(this);
  }

  onZoom(concept) {
    this.initialZoomedConcept = concept;
  }

  render() {
    return presenter({
      ...this.props,
      onZoom: this.onZoom,
      initialZoomedConcept: this.initialZoomedConcept,
    });
  }
}

function mapStateToProps(state) {
  const reportData = selectors.getReportData(state);
  const details = get(state, 'dataCatalog.reportDetails.data.result');
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
    conditions: reportData,
    details,
    tableData,
    tableColumns,
  };
}

const mapDispatchToProps = {
  loadDetails: params => actions.dataCatalog.reportDetails.find(params),
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    loadConditionDetails: (conceptId) => {
      dispatchProps.loadDetails({
        uuid: ownProps.dataSourceUuid,
        path: 'procedures',
        filename: `procedure_${conceptId}.json`,
      });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Procedures);
