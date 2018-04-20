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
 * Created: December 27, 2016
 *
 */

import React from 'react';
import BEMHelper from 'services/BemHelper';
import { Modal } from 'arachne-ui-components';
import { Form, Checkbox, ListItem, Button } from 'arachne-ui-components';
import DataSources from 'modules/AnalysisExecution/components/ViewEditAnalysis/DataSources';

require('./style.scss');

function ToggleAll(props) {
  return (
    <ListItem>
      <FormCheckbox {...props} />
    </ListItem>
  );
}

function ModalSubmitCode(props) {
  const classes = new BEMHelper('analysis-form-submit-code');

  const fields = [
    {
      name: 'dataSources',
      InputComponent: {
        component: DataSources,
        props: {
          dataSources: props.dataSourceOptions,
        },
      }
    }
  ];
  
  const submitBtn = {
    label: 'Submit',
    loadingLabel: 'Submitting...',
    mods: ['success', 'rounded'],
  };

  const cancelBtn = {
    label: 'Cancel',
  };

  return (
    <Modal modal={props.modal} title="Submit code to data nodes" mods={['no-padding']}>
      <div {...classes()}>
        <ListItem>
          <div {...classes('top-line')}>
            <Checkbox
              {...classes('toggle-btn')}
              label='Select all'
              isChecked={props.isAllSelected}
              onChange={props.toggleAll}
            />
            <Button {...classes('invite-button')} onClick={props.inviteDatasource}>
              <span {...classes('invite-button-icon')}>add_circle_outline</span>
              Invite Data Sources
            </Button>
          </div>
        </ListItem>
        <Form
          mods="spacing-sm"
          fields={fields}
          submitBtn={submitBtn}
          cancelBtn={cancelBtn}
          onSubmit={props.doSubmit}
          onCancel={props.modal.close}
          {...props}
        />
      </div>
    </Modal>
  );
}

export default ModalSubmitCode;
