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

import { Component, PropTypes } from 'react';
import actions from 'actions';
import { ContainerBuilder, get } from 'services/Utils';
import { forms } from 'modules/DataCatalog/const';
import { modelTypesValues, attributeNames, executionPolicy } from 'const/dataSource';
import isEmpty from 'lodash/isEmpty';
import presenter from './presenter';
import SelectorsBuilder from './selectors';
import { Notifier } from 'services/Notifier';

const selectors = (new SelectorsBuilder()).build();

/** @augments { Component<any, any> } */
export class AttributeList extends Component {
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
    const values = selectors.getValues(state);
    const initialValues = selectors.getData(state);
    let isCDM = initialValues[attributeNames.modelType] === modelTypesValues.CDM;
    const isManual = initialValues[attributeNames.executionPolicy] === executionPolicy.MANUAL;
    if (!isEmpty(values)) {
      isCDM = values[attributeNames.modelType] === modelTypesValues.CDM;
    }

    const attrList = selectors.getAttrList(state)
    .filter((attr) => isManual ? true : !attr.onlyManual)
    .map((attr) => {
      const attribute = { ...attr };
      if (attr.name === attributeNames.dbmsType) {
        attribute.options = selectors.getDbmsTypes(state);
      }

      return attribute;
    });

    return {
      attrList,
      initialValues,
      dataSourceId,
      isPublished,
      isCDM,
    };
  }

  getMapDispatchToProps() {
    return {
      update: actions.dataCatalog.dataSource.update,
      load: actions.dataCatalog.dataSource.find,
      getDbmsTypes: actions.dataCatalog.dbmsTypes.find,
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
          Notifier.alert('Data source was successfully published');
          dispatchProps.load({ id: stateProps.dataSourceId });
        }

        return result;
      },
    };
  }

}
