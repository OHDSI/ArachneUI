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
 * Created: December 20, 2016
 *
 */

import React from 'react';
import {
  Modal,
  LoadingPanel,
  Form,
} from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import { getDataSourceCreationFields } from 'const/dataSource';
import TabbedForm from './TabbedForm';

require('./style.scss');

function ModalCreateEdit(props) {
  const classes = new BEMHelper('data-source-list-form-create');

  const {
    isLoading,
    isStandalone,
    dbmsTypeList,
    dbmsType,
  } = props;

  let modalTitle;
  let submitBtn;
  if (props.dataSourceId) {
     modalTitle = 'Edit data source';
     submitBtn  = {
        label: 'Save',
        loadingLabel: 'Saving...',
      }
  } else {
    modalTitle = 'Create data source';
    submitBtn = {
      label: 'Create',
      loadingLabel: 'Creating...',
    }
  }

  const cancelBtn = {
    label: 'Cancel',
  };

  const disabledFields = {
    name: isStandalone && props.initialValues.centralId,
  };
  const fields = getDataSourceCreationFields(dbmsTypeList, false, disabledFields);

  const form = 'IMPALA' === dbmsType ? <TabbedForm {...props} /> : (<Form
      {...classes()}
      fields={fields}
      submitBtn={submitBtn}
      cancelBtn={cancelBtn}
      onSubmit={props.doSubmit}
      onCancel={props.modal.close}
      {...props}
    />
  );

  return (
    <Modal modal={props.modal} title={modalTitle} mods={['no-padding']}>
      {form}
      <LoadingPanel active={isLoading}/>
    </Modal>
  );
}

export default ModalCreateEdit;