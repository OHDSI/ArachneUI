/*
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
 * Authors: Anton Gackovka
 * Created: May 24, 2018
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

  const { 
    selectedUsers,
  } = props;

  return (
    <Modal modal={props.modal} title="Add to tenants">
      <div {...classes()}>
        {selectedUsers.join(',')}
      </div>
    </Modal>
  );
}

export default ModalAddUser;