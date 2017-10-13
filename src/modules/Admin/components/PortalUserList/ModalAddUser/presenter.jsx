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
 * Created: September 29, 2017
 *
 */

import React from 'react';
import { Modal } from 'arachne-ui-components';
import { Form } from 'arachne-ui-components';
import { FormInput } from 'arachne-ui-components';
import { FormSelect, FormAutocomplete } from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';
import { registerFields } from 'modules/Auth/const';

require('./style.scss');

function ModalAddUser(props) {
  const classes = new BEMHelper('admin-panel-modal-add-user');

  const submitBtn = {
    label: 'Add',
    loadingLabel: 'Adding...',
    mods: ['success', 'rounded'],
  }

  const cancelBtn = {
    label: 'Cancel',
  }

  return (
    <Modal modal={props.modal} title="Add user">
      <div {...classes()}>
        <Form
          mods={["spacing-actions-sm"]}
          fields={registerFields(props)}
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

export default ModalAddUser;