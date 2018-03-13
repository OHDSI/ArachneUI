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
 * Created: January 31, 2018
 *
 */

import actions from 'actions';
import { ContainerBuilder, get } from 'services/Utils';
import { forms } from 'modules/DataCatalog/const';
import { modelTypesValues, attributeNames } from 'const/dataSource';
import AttributeList from './presenter';
import SelectorsBuilder from './selectors';

const selectors = (new SelectorsBuilder()).build();

export default class AttributeListBuilder extends ContainerBuilder {
  getComponent() {
    return AttributeList;
  }

  getFormParams() {
    return {
      form: forms.editDataSource,
      enableReinitialize: true,
    };
  }

  mapStateToProps(state) {
    const dataSourceId = get(state, 'dataCatalog.dataSource.data.result.id');
    const isPublished = get(state, 'dataCatalog.dataSource.data.result.published');
    const isCDM = get(state, `form.${forms.editDataSource}.values.${attributeNames.modelType}`) === modelTypesValues.CDM;

    return {
      attrList: selectors.getAttrList(state),
      initialValues: selectors.getData(state),
      dataSourceId,
      isPublished,
      isCDM,
    };
  }

  getMapDispatchToProps() {
    return {
      update: actions.dataCatalog.dataSource.update,
      load: actions.dataCatalog.dataSource.find,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      async doSubmit(data) {
        const result = await dispatchProps.update({
          id: stateProps.dataSourceId,
        }, data);
        if (!stateProps.isPublished) {
          alert('Data source is successfully published');
          dispatchProps.load({ id: stateProps.dataSourceId });
        }

        return result;
      },
    };
  }

}
