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
 * Created: December 13, 2016
 *
 */

import React, { Component } from 'react';
import { Form, FormInput, FormSelect, Modal } from 'arachne-ui-components';
import BEMHelper from 'services/BemHelper';

require('./style.scss');

class ModalCreateAnalysis extends Component {

  constructor() {
    super();
    this.getClasses = this.getClasses.bind(this);
    this.getFields = this.getFields.bind(this);
  }

  getClasses() {
    return new BEMHelper('study-form-create-analysis');
  }

  getFields({ analysisTypes }) {
    return [
      {
        name: 'title',
        InputComponent: {
          component: FormInput,
          props: {
            mods: ['bordered'],
            placeholder: 'Title',
            type: 'text',
          },
        },
      },
      {
        name: 'typeId',
        InputComponent: {
          component: FormSelect,
          props: {
            mods: ['bordered'],
            placeholder: 'Type',
            options: analysisTypes,
          },
        },
      },
    ];
  }

  render() {
    const classes = this.getClasses();
    const fields = this.getFields(this.props);

    const submitBtn = {
      label: 'Create',
      loadingLabel: 'Creating...',
      mods: ['success', 'rounded'],
    };

    const cancelBtn = {
      label: 'Cancel',
    };

    return (
      <Modal modal={this.props.modal} title="Create analysis">
        <div {...classes()}>
          <Form
            mods="spacing-actions-sm"
            fields={fields}
            submitBtn={submitBtn}
            cancelBtn={cancelBtn}
            onSubmit={this.props.doSubmit}
            onCancel={this.props.modal.close}
            {...this.props}
          />
        </div>
      </Modal>
    );
  }

}

export default ModalCreateAnalysis;
