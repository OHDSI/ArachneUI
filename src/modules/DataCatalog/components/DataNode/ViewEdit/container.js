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
  * Created: Thursday, June 14, 2018 6:41 PM
  *
  */

//@ts-check
import { Component, PropTypes } from 'react';
import actions from 'actions';
import { ContainerBuilder, get } from 'services/Utils';


import presenter from './presenter';


/** @augments { Component<any, any> } */
export class ViewEdit extends Component {
  static get propTypes() {
    return {
    };
  }
  
  componentWillMount() {
    this.props.load({ id: this.props.id });
  }
  

  render() {
    return presenter(this.props);
  }
}
 
export default class ViewEditBuilder extends ContainerBuilder {
  getComponent() {
    return ViewEdit;
  }

  mapStateToProps(state, ownProps) {
    const dataNode = get(state, 'dataCatalog.dataNode.data.result', {
      name: 'Unknown data node',
      description: '',
      organization: 'Unknown',
    });
    const dataSources = [];

    return {
      id: ownProps.routeParams.datanodeId,
      dataNode,
      dataSources,
      organization: get(dataNode, 'organization', 'Unknown', 'String'),
    };
  }

  /**
   * @returns { { [x: string]: any } }
   */
  getMapDispatchToProps() {
    return {
      load: actions.dataCatalog.dataNode.find,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      
    };
  }
}
 
