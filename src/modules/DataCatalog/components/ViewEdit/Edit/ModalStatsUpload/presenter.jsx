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
  * Created: Thursday, February 15, 2018 6:44 PM
  *
  */

  import React from 'react';
  import {
    Modal,
    Form,
    FormFileInput,
  } from 'arachne-ui-components';
  import BEMHelper from 'services/BemHelper';
  
  import './style.scss';
  
  function ModalStatsUpload(props) {
    const classes = new BEMHelper('modal-stats-upload');
    
    const fields = [
      {
        name: 'archive',
        InputComponent: {
          component: FormFileInput,
          props: {
            mods: ['bordered'],
            placeholder: 'Archive',
            filePlaceholder: 'Archive',
            dropzonePlaceholder: 'Drag and drop zip file',
          }
        },
      },
    ];
  
    const submitBtn = {
      label: 'Upload',
      loadingLabel: 'Uploading...',
      mods: ['success', 'rounded'],
    }
  
    const cancelBtn = {
      label: 'Cancel',
    }
  
    return (
      <Modal modal={props.modal} title="Upload Achilles stats">
        <div {...classes()}>          
          <Form
            fields={fields}
            submitBtn={submitBtn}
            cancelBtn={cancelBtn}
            onCancel={props.closeModal}
            onSubmit={props.doSubmit}
            {...props}
          />          
        </div>
      </Modal>
    );
  }
  
  export default ModalStatsUpload;
  
