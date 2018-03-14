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
 * Created: April 21, 2017
 *
 */

import { reset as resetForm } from 'redux-form';
import actions from 'actions';
import { forms } from 'modules/DataCatalog/const';
import { ContainerBuilder, get } from 'services/Utils';
import CreateDataNode from './presenter';

export default class FormCreateDataNode extends ContainerBuilder {
  getComponent() {
    return CreateDataNode;
  }

  getFormParams() {
    return {
      form: forms.createDataNode,
    };
  }

  mapStateToProps(state) {
    const isLoading = get(state, 'dataCatalog.dataNode.isLoading', false);
    const datanodeId = get(state, 'dataCatalog.dataSource.data.result.dataNode.id');
    const dataNodes = get(state, 'dataCatalog.dataNode.data', [], 'Array').map((node) => ({
      value: node.centralId,
      label: node.name,
    }));

    return {
      isLoading,
      datanodeId,
      dataNodes,
    };
  }

  getMapDispatchToProps() {
    return {
      reset: () => resetForm(forms.createDataNode),
      update: actions.dataCatalog.dataNode.update,
      loadDataSource: actions.dataCatalog.dataSource.find,
      loadDataNodes: actions.dataCatalog.dataNode.find,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...dispatchProps,
      async doSubmit(data) {
        const submitPromise = await dispatchProps.update({ id: stateProps.datanodeId }, { ...data, name: data.node });
        await dispatchProps.loadDataSource({
          id: ownProps.dataSourceId,
        });

        return submitPromise;
      },
      loadDataNodes(query) {
        dispatchProps.loadDataNodes({}, { query });
      },
      ...ownProps, // allow redefining of the doSubmit method via own props
    };
  }
}
