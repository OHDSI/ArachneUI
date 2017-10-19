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
 * Created: December 13, 2016
 *
 */

import React, { PropTypes } from 'react';
import BEMHelper from 'services/BemHelper';
import { Modal, TabbedPane } from 'arachne-ui-components';
import DataCatalogSource from './DataCatalogSource';
import VirtualSource from './VirtualSource';

require('./style.scss');

function ModalAddDataSource(props) {
  const classes = new BEMHelper('study-modal-add-source');
  const {
    dataSourceId,
  } = props;

  const sections = [];
  if (!dataSourceId) {
    sections.push({
      label: 'Data catalog',
      content: <DataCatalogSource/>,
    });
  }
  sections.push({
    label: 'Virtual source',
    content: <VirtualSource dataSourceId={dataSourceId}/>,
  });
  return (
    <div {...classes()}>
      <Modal modal={props.modal} title="Add data source">
        <div {...classes('content')}>
          <TabbedPane sections={sections} />
        </div>
      </Modal>
    </div>
  );
}

export default ModalAddDataSource;
