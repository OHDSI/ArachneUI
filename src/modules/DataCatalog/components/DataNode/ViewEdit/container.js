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
  * Created: June 14, 2018
  *
  */

//@ts-check
import { Component, PropTypes } from 'react';
import actions from 'actions';
import { ContainerBuilder, get } from 'services/Utils';
import { goBack } from 'react-router-redux';
import { DataNodeSelectors } from './selectors';
import { ModalUtils } from 'arachne-ui-components';
import presenter from './presenter';
import { modal, form } from 'modules/DataCatalog/const';

const selectors = (new DataNodeSelectors).build();

/** @augments { Component<any, any> } */
export class ViewEdit extends Component {
  static get propTypes() {
    return {
    };
  }
  
  async componentWillMount() {
    await this.props.load({ id: this.props.id });
    this.props.loadDataSources({ id: this.props.id });
  }
  

  render() {
    return presenter(this.props);
  }
}
 
export default class ViewEditBuilder extends ContainerBuilder {
  getComponent() {
    return ViewEdit;
  }

  getFormParams() {
    return {
      name: form.editDataNode,
    };
  }

  mapStateToProps(state, ownProps) {
    const dataNode = selectors.getDataNode(state);
    const dataSources = selectors.getDataSources(state);

    return {
      id: ownProps.routeParams.datanodeId,
      dataNode,
      dataSources,
    };
  }

  /**
   * @returns { { [x: string]: any } }
   */
  getMapDispatchToProps() {
    return {
      load: actions.dataCatalog.dataNode.find,
      loadDataSources: actions.dataCatalog.dataNodeDataSources.query,
      goBack,
      showNameEditDialog: () => ModalUtils.actions.toggle(modal.editDataNodeTitle, true),
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
    const id = params.datanodeId;
    return {
      load: actions.dataCatalog.dataNode.find.bind(null, { id }),
      loadDataSources: actions.dataCatalog.dataNodeDataSources.query.bind(null, { id }),
    };
  }
}
 
