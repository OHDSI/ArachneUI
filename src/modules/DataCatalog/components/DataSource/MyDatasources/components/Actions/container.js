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
  * Created: Wednesday, February 14, 2018 3:10 PM
  *
  */

//@ts-check
import { Component, PropTypes } from 'react';
import actions from 'actions';
import { ContainerBuilder, get } from 'services/Utils';
import { ModalUtils } from 'arachne-ui-components';
import presenter from './presenter';
import { modal } from 'modules/DataCatalog/const';

export class Actions extends Component {
  static get propTypes() {
    return {
    };
  } 

  render() {
    return presenter(this.props);
  }
}
 
export default class ActionsBuilder extends ContainerBuilder {
  getComponent() {
    return Actions;
  }  
 
  mapStateToProps(state, ownProps) {     

    return {
    };
  }

  /**
   * @returns { { [x: string]: any } }
   */
  getMapDispatchToProps() {
    return {
      openCreateModal: () => ModalUtils.actions.toggle(modal.modalCreateDatanode, true),
    };
  }
}
