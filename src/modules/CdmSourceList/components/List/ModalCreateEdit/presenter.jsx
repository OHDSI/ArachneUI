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
 * Created: December 20, 2016
 *
 */

import React from 'react';
import { Modal } from 'arachne-ui-components';
import { LoadingPanel } from 'arachne-ui-components';
import { Form } from 'arachne-ui-components';
import { FormInput } from 'arachne-ui-components';
import { FormSelect } from 'arachne-ui-components';
import { FormTextarea } from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import { cdmSpecificAttributes } from 'const/dataSource';
import PasswordField from 'components/PasswordField/connected';

require('./style.scss');

function ModalCreateEdit(props) {
  const classes = new BEMHelper('data-source-list-form-create');

  const {
    cdmVersionList,
    isLoading,
    dataLicenseTypeList,
    dataTypeList,
    dbmsTypeList,
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

  const fields = [
    {
      name: 'name',
      className: 'col-xs-12',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Name of data source *',
          type: 'text',
        },
      },
    },
    {
      name: 'dbmsType',
      className: 'col-xs-12',
      InputComponent: {
        component: FormSelect,
        props: {
          mods: ['bordered'],
          placeholder: 'DBMS Type',
          options: dbmsTypeList,
        },
      },
    },
    {
      name: 'connectionString',
      className: 'col-md-12',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Connection string *',
          type: 'text',
        },
      },
    },
    {
      name: 'cdmSchema',
      className: 'col-xs-12',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'CDM schema name *',
          type: 'text',
        },
      },
    },
    {
      name: 'dbUsername',
      className: 'col-md-12',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: 'Username *',
          type: 'text',
        },
      },
    },
    {
      name: 'dbPassword',
      className: 'col-md-12',
      InputComponent: {
        component: PasswordField,
        props: {
          mods: ['bordered'],
          placeholder: 'Password *',
          type: 'password',
          showHint: false,
        },
      },
    },
    ...cdmSpecificAttributes.map(attribute => ({
      name: attribute.name,
      className: 'col-md-12',
      InputComponent: {
        component: FormInput,
        props: {
          mods: ['bordered'],
          placeholder: attribute.label,
        },
      },
    })),
  ];

  return (
    <Modal modal={props.modal} title={modalTitle}>
      <Form
        {...classes({ extra: 'row' })}
        actionsClassName="col-xs-12"
        fields={fields}
        submitBtn={submitBtn}
        cancelBtn={cancelBtn}
        onSubmit={props.doSubmit}
        onCancel={props.modal.close}
        {...props}
      />
      <LoadingPanel active={isLoading}/>
    </Modal>
  );
}

export default ModalCreateEdit;