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
 * Authors: Alexander Saltykov
 * Created: November 20, 2017
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Panel,
} from 'arachne-ui-components';
import Table from 'components/Charts/Table';

import './style.scss';

function DataCompleteness(props) {
  const classes = new BEMHelper('report-data-completeness');
  const {
    tableData,
    tableColumns,
  } = props;

  return (
    <div {...classes()}>
      <Panel title={'Data completeness'}>
        <Table
          data={tableData}
          columns={tableColumns}
          pageSize={20}
        />
      </Panel>
    </div>
  );
}

DataCompleteness.propTypes = {
};

export default DataCompleteness;