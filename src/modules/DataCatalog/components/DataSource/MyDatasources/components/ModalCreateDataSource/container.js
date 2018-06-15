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
  * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
  * Created: Thursday, February 22, 2018 2:56 PM
  *
  */

//@ts-check
import { Component, PropTypes } from 'react';
import actions from 'actions';
import { ContainerBuilder, get } from 'services/Utils';
import { forms, modal, paths } from 'modules/DataCatalog/const';
import { ModalUtils } from 'arachne-ui-components';
import { executionPolicy } from 'const/dataSource';
import { push } from 'react-router-redux';
import presenter from './presenter';
import SelectorsBuilder from './selectors';

const selectors = new SelectorsBuilder().build();

/** @augments { Component<any, any> } */
export class ModalCreateDataSource extends Component {
  static get propTypes() {
    return {
      getDbmsTypes: PropTypes.func,
    };
  }

  componentWillMount() {
    this.props.getDbmsTypes();
  }

  render() {
    return presenter(this.props);
  }
}
 
export default class ModalCreateDataSourceBuilder extends ContainerBuilder {
  getComponent() {
    return ModalCreateDataSource;
  }
  
  getFormParams() {
    return {
      form: forms.modalCreateDataSource,
      enableReinitialize: false,
    };
  }
  
  getModalParams() {
    return {
      name: modal.modalCreateDataSource,
    };
  }  
 
  mapStateToProps(state, ownProps) {
    const dbmsTypeList = selectors.getDbmsTypes(state);
    const dataNodeId = get(state, `modal.${modal.modalCreateDataSource}.data.dataNodeId`);

    return {
      // TODO: pass query params to use in createDS callback
      dbmsTypeList,
      dataNodeId,
    };
  }

  /**
   * @returns { { [x: string]: any } }
   */
  getMapDispatchToProps() {
    return {
      closeModal: () => ModalUtils.actions.toggle(modal.modalCreateDataSource, false),
      createDS: actions.dataCatalog.dataSource.create,
      getDbmsTypes: actions.dataCatalog.dbmsTypes.find,
      showDs: id => push(paths.edit(id)),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      async doSubmit(data) {
        const result = await dispatchProps.createDS(
          {
            dataNodeId: stateProps.dataNodeId,
          },
          {
            ...data,
            executionPolicy: executionPolicy.MANUAL,
          }
        );
        if (result) {
          await dispatchProps.closeModal();
          dispatchProps.showDs(get(result, 'result.id'));
        }

        return result;
      },
    };
  }

} 
