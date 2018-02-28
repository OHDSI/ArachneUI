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
  * Created: Monday, February 26, 2018 4:17 PM
  *
  */

import React from 'react';
import {
  Modal,
  Form,
  FacetedSearchPanel as FacetedSearch,
} from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import { addAnyOption } from 'components/FiltersList/presenter';

import './style.scss';

function SubmissionsTableFilter(props) {
  const classes = new BEMHelper('submissions-table-filter');
  const {
    modal,
    doSubmit,
    doClear,
    handleSubmit,
    dataSourceList,
    statusList,
  } = props;
  
  const fields = [
    {
      type: 'TOGGLE', // TODO: const
      name: 'INSIGHT',
      label: 'Has insight',
      forceOpened: true,
    },
    {
      type: 'ENUM', // TODO: const
      name: 'DATASOURCE',
      options: dataSourceList,
      label: 'Data source',
      forceOpened: true,
    },
    {
      type: 'ENUM', // TODO: const
      name: 'STATUS',
      options: statusList,
      label: 'Status',
      forceOpened: true,
    },
  ];

  const submitBtn = {
    label: 'Filter',
    loadingLabel: 'Filtering...',
    mods: ['success', 'rounded'],
  }

  const cancelBtn = {
    label: 'Cancel',
  }

  return (
    <Modal
      modal={modal}
      title="Filter submissions table"
      mods={['no-padding']}
    >
      <div {...classes()}>
        <FacetedSearch
          doSubmit={doSubmit}
          doClear={doClear}
          dynamicFields={fields.map(addAnyOption)}
          fullTextSearchEnabled={false}
          sortingEnabled={false}
          showRefineSearch={false}
          isAccordion
          handleSubmit={handleSubmit}
        />
      </div>
    </Modal>
  );
}

export default SubmissionsTableFilter;  
