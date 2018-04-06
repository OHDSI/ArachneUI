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

//@ts-check
import { Component, PropTypes } from 'react';
import actions from 'actions';
import { ContainerBuilder, get, buildFormData } from 'services/Utils';
import { forms, modal } from 'modules/DataCatalog/const';
import { ModalUtils } from 'arachne-ui-components';

import presenter from './presenter';


export class ModalStatsUpload extends Component {
  static get propTypes() {
    return {
    };
  } 

  render() {
    return presenter(this.props);
  }
}
 
export default class ModalStatsUploadBuilder extends ContainerBuilder {
  getComponent() {
    return ModalStatsUpload;
  }

  
  getFormParams() {
    return {
      form: forms.modalStatsUpload,
      enableReinitialize: false,
    };
  }
  
  getModalParams() {
    return {
      name: modal.modalStatsUpload,
    };
  }
  
 
  mapStateToProps(state, ownProps) {
      const id = get(state, 'dataCatalog.dataSource.data.result.id');

    return {
      id,
    };
  }

  /**
   * @returns { { [x: string]: any } }
   */
  getMapDispatchToProps() {
    return {
      upload: actions.dataCatalog.achillesResults.upload,
      closeModal: () => ModalUtils.actions.toggle(modal.modalStatsUpload, false),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      async doSubmit(data) {
        const file = buildFormData({ file: get(data, 'archive[0]', {}) });
        const promise = await dispatchProps.upload({ id: stateProps.id }, file);
        dispatchProps.closeModal();

        return promise;
      },
    };
  }
}
 
