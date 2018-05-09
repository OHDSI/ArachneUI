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
  * Created: Wednesday, February 14, 2018 3:07 PM
  *
  */

//@ts-check
import { Component, PropTypes } from 'react';
import actions from 'actions';
import { ContainerBuilder, get } from 'services/Utils';
import { modal } from 'modules/DataCatalog/const';
import { ModalUtils } from 'arachne-ui-components';

import presenter from './presenter';
import SelectorsBuilder from './selectors';
import { Notifier } from 'services/Notifier';

const selectors = (new SelectorsBuilder()).build();

export class ModalCreateDatanode extends Component {
  static get propTypes() {
    return {
    };
  }

  render() {
    return presenter(this.props);
  }
}

export default class ModalCreateDatanodeBuilder extends ContainerBuilder {
  getComponent() {
    return ModalCreateDatanode;
  }

  getModalParams() {
    return {
      name: modal.modalCreateDatanode,
    };
  }

  mapStateToProps(state, ownProps) {

    const formValues = selectors.getValues(state);
    const selectedOrganizationId = get(formValues, 'organization');
    const selectedNodeId = get(formValues, 'node');

    const selectedNode = selectors.getDataNodeOptions(state).find(node => node.centralId === selectedNodeId);
    const selectedOrganization = selectors.getOrganizations(state).find(organization => organization.id === selectedOrganizationId);

    const createdOrganization = selectors.getNewOrganization(state);

    return {
      selectedObjects: { selectedNode, selectedOrganization },
      createdObjects: { createdOrganization },
    };
  }

  /**
   * @returns { { [x: string]: any } }
   */
  getMapDispatchToProps() {
    return {
      closeModal: () => ModalUtils.actions.toggle(modal.modalCreateDatanode, false),
      createDN: actions.dataCatalog.dataNode.create,
      openCreateDataSourceModal: dataNodeId => ModalUtils.actions.toggle(modal.modalCreateDataSource, true, { dataNodeId }),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      async chooseDataNode({ node }) {
        if (!node) {
          Notifier.alert({ message: 'You should create or choose existing Data Node first' });
          return false;
        }
        await dispatchProps.closeModal();
        dispatchProps.openCreateDataSourceModal(node);
      },
      async doSubmit(data) {
        const selectedObjects = stateProps.selectedObjects;
        const selectedNode = selectedObjects.selectedNode;

        let id = selectedNode.centralId;
        if (id === -1) {
          const selectedOrganization = selectedObjects.selectedOrganization;
          const organizationId = selectedOrganization.id;
          const organization = organizationId === -1
            ? {
              id: null,
              name: stateProps.createdObjects.createdOrganization.name,
            }
            : {
              id: organizationId,
              name: null,
            };
          let dataNode = {
            name: selectedNode.name,
            description: data.description,
            organization,
          };
          dataNode = await dispatchProps.createDN({}, dataNode);
          id = dataNode.centralId;
        }
        dispatchProps.closeModal();
        dispatchProps.openCreateDataSourceModal(id);
      },
    };
  }
}
