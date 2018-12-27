/*
  *
  * Copyright 2018 Observational Health Data Sciences and Informatics
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
  * Authors: Alexander Saltykov
  * Created: June 25, 2018
  *
  */

//@ts-check
import { Component, PropTypes } from 'react';
import actions from 'actions';
import { ContainerBuilder, get } from 'services/Utils';
import { forms } from 'modules/DataCatalog/const';
import { modal } from 'modules/DataCatalog/const';
import { ModalUtils } from 'arachne-ui-components';
import presenter from './presenter';
import { DataNodeSelectors } from 'modules/DataCatalog/components/DataNode/ViewEdit/selectors';

const selectors = (new DataNodeSelectors()).build();

/** @augments { Component<any, any> } */
export class EditDataNodeTitle extends Component {
  static get propTypes() {
    return {
    };
  } 

  render() {
    return presenter(this.props);
  }
}
 
export default class EditDataNodeTitleBuilder extends ContainerBuilder {
  getComponent() {
    return EditDataNodeTitle;
  }

  
  getFormParams() {
    return {
      form: forms.editDataNodeTitle,
      enableReinitialize: true,
    };
  }
  
  
  getModalParams() {
    return {
      name: modal.editDataNodeTitle,
    };
  }
  
 
  mapStateToProps(state) {
    const node = selectors.getDataNode(state);

    return {
      ...node,
      initialValues: { name: node.name },
    };
  }

  /**
   * @returns { { [x: string]: any } }
   */
  getMapDispatchToProps() {
    return {
      closeModal: () => ModalUtils.actions.toggle(modal.editDataNodeTitle, false), 
      update: actions.dataCatalog.dataNode.update,
      loadDataNode: actions.dataCatalog.dataNode.find,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,      
      async doSubmit({ name }) {
        const result = await dispatchProps.update(
          { id: stateProps.id },
          { name }
        );
        dispatchProps.closeModal();
        dispatchProps.loadDataNode({ id: stateProps.id });

        return result;
      }      
    };
  }

}
 
