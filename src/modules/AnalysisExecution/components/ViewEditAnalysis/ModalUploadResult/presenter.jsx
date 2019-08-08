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
 * Created: March 14, 2017
 *
 */

import React, { Component } from 'react';
import BEMHelper from 'services/BemHelper';
import {
  Modal,
  Form,
  FormFileInput,
  TabbedPane,
} from 'arachne-ui-components';
import { SECTIONS } from './const';
import { get } from 'services/Utils';

require('./style.scss');

class ModalSubmitCode extends Component {
  state = {
    selectedTab: SECTIONS.FILES,
  }

  get submitBtn() {
    return {
      label: 'Upload',
      loadingLabel: 'Uploading...',
      mods: ['success', 'rounded'],
      disabled: !this.props.isUploadFormValid,
    }
  };

  get cancelBtn() {
    return {
      label: 'Cancel',
    };
  }

  get Form() {
    const { resetForm, closeModal, doSubmit, ...props } = this.props;
    return (
      <Form
        mods="spacing-sm"
        fields={this.fields}
        submitBtn={this.submitBtn}
        cancelBtn={this.cancelBtn}
        onSubmit={(values) => doSubmit(values, this.state.selectedTab)}
        onCancel={() => { resetForm(); closeModal() }}
        {...props}
      />
    );
  }

  get fields() {
    const { selectedTab } = this.state;
    const isFiles = selectedTab === SECTIONS.FILES;
    const placeholder = isFiles ? 'Add separate files' : 'Add files in archive';

    return [
      {
        name: 'result',
        InputComponent: {
          component: FormFileInput,
          props: {
            mods: ['bordered'],
            placeholder,
            dropzonePlaceholder: 'Drag and drop file',
            multiple: isFiles,
            accept: isFiles ? [] : ['.zip'],
            filePlaceholder: 'Document name',
          },
        },
      },
    ];
  }

  get sections() {
    return [
      {
        label: SECTIONS.FILES,
        content: this.Form,
      },
      {
        label: SECTIONS.ARCHIVE,
        content: this.Form,
      },
    ];
  }

  changeTab = tabName => {
    this.props.resetForm();
    this.setState({ selectedTab: tabName });
  }

  render() {
    const { modal } = this.props;
    const { selectedTab } = this.state;
    const classes = new BEMHelper('analysis-form-upload-result');
    return (
      <Modal modal={modal} title="Add result files">
        <div {...classes()}>
          <TabbedPane sections={this.sections} value={selectedTab} onChange={this.changeTab} />
        </div>
      </Modal>
    );
  }
}

export default ModalSubmitCode;
