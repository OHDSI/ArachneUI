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
 * Created: February 03, 2017
 *
 */

// @ts-check
import { Component, PropTypes } from 'react';
import actions from 'actions/index';
import { get } from 'services/Utils';
import isEmpty from 'lodash/isEmpty';
import { Utils, ContainerBuilder } from 'services/Utils';
import presenter from './presenter';

// TODO!!!
/** @augments { Component<any, any> } */
class StatefulView extends Component {
  static propTypes() {
    return {
      dataSourceId: PropTypes.string.isRequired,
      loadDataSource: PropTypes.func.isRequired,
      loadReportsList: PropTypes.func.isRequired,
      loadCharacterization: PropTypes.func,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dataSourceId !== nextProps.dataSourceId) {
      this.props.loadDataSource({ id: nextProps.dataSourceId });
      this.props.loadReportsList({ id: nextProps.dataSourceId });
      this.props.loadCharacterization({ id: nextProps.dataSourceId });
    }
  }

  render() {
    return presenter(this.props);
  }
}

class DataCatalogViewBuilder extends ContainerBuilder {

  getComponent() {
    return StatefulView;
  }

  mapStateToProps(state, ownProps) {
    const moduleState = get(state, 'dataCatalog');
    const reportsAvailable = get(state, 'dataCatalog.report.queryResult.result', [], 'Array').length > 0;
    const isDenied = isEmpty(get(state, 'dataCatalog.dataSource.data.result', {}, 'Object'));
  
    return {
      dataSourceId: ownProps.routeParams.dataSourceId,
      isLoading: moduleState.dataSource.isLoading || moduleState.characterization.isLoading,
      reportsAvailable,
      isProfileSelected: get(ownProps, 'route.params.isProfileSelected', false),
      name: `${get(moduleState, 'dataSource.data.result.dataNode.name', 'Not published')}: ${get(moduleState, 'dataSource.data.result.name', '')}`,
      modelType: get(moduleState, 'dataSource.data.result.modelType', ''),
      isDenied,
    };
  }

  getMapDispatchToProps() {
    return {
      loadDataSource: actions.dataCatalog.dataSource.find,
      loadReportsList: actions.dataCatalog.report.query,
      loadCharacterization: actions.dataCatalog.characterization.find,
    };
  }

  getFetchers({ params, state, dispatch }) {
    const id = params.dataSourceId;
    return {
      loadDataSource: actions.dataCatalog.dataSource.find.bind(null, { id: id }),
      loadReportsList: actions.dataCatalog.report.query.bind(null, { id: id }),
      loadCharacterization: actions.dataCatalog.characterization.find.bind(null, { id: id }),
    };
  }

}

export default DataCatalogViewBuilder;
export {
  StatefulView,
};
