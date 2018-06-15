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
  * Created: Thursday, February 22, 2018 2:56 PM
  *
  */

import React from 'react';
import { Modal, Form } from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';

import './style.scss';
import { getDataSourceCreationFields } from 'const/dataSource';

function ModalCreateDataSource(props) {
  const classes = new BEMHelper('modal-create-data-source');
  const { dbmsTypeList = [], closeModal } = props;
    
  const submitBtn = {
    label: 'Add',
    loadingLabel: 'Adding...',
    mods: ['success', 'rounded'],
  }

  const cancelBtn = {
    label: 'Cancel',
  }

  return (
    <Modal modal={props.modal} title="Create manual data source">
      <div {...classes()}>          
        <Form
          fields={getDataSourceCreationFields(dbmsTypeList, true)}
          submitBtn={submitBtn}
          cancelBtn={cancelBtn}
          onSubmit={props.doSubmit}
          onCancel={closeModal}
          {...props}
        />          
      </div>
    </Modal>
  );
}

export default ModalCreateDataSource;

