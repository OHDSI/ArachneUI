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
  * Created: Tuesday, May 22, 2018 7:18 PM
  *
  */

//@ts-check
import { Component, PropTypes } from 'react';
import actions from 'actions';
import { ContainerBuilder, get } from 'services/Utils';


import { modal } from 'modules/AnalysisExecution/const';
import { ModalUtils } from 'arachne-ui-components';
import presenter from './presenter';


/** @augments { Component<any, any> } */
export class ModalError extends Component {
  static get propTypes() {
    return {
    };
  } 

  render() {
    return presenter(this.props);
  }
}
 
export default class ModalErrorBuilder extends ContainerBuilder {
  getComponent() {
    return ModalError;
  }

  getModalParams() {
    return {
      name: modal.modalError,
    };
  }
  
  mapStateToProps(state, ownProps) {     
    const errors = get(state, 'modal.modalError.data', [], 'Array');

    return {
      errors,
    };
  }

  /**
   * @returns { { [x: string]: any } }
   */
  getMapDispatchToProps() {
    return {
      
      openModal: data => ModalUtils.actions.toggle(
        modal.modalError,
        true,
        data
      ),
      closeModal: () => ModalUtils.actions.toggle(modal.modalError, false),
        
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      
    };
  }

  getFetchers({ params, state, dispatch }) {
    
    return {
    };
  }

}
 
