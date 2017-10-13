/**
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
import get from 'lodash/get';
import { Utils } from 'services/Utils';
import presenter from './presenter';

// TODO!!!
/** @augments { Component<any, any> } */
class StatefulViewEdit extends Component {
  static propTypes() {
    return {
      dataSourceUuid: PropTypes.string.isRequired,
      loadDataSource: PropTypes.func.isRequired,
      loadReportsList: PropTypes.func.isRequired,
      loadCharacterization: PropTypes.func,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dataSourceUuid !== nextProps.dataSourceUuid) {
      this.props.loadDataSource({ uuid: nextProps.dataSourceUuid });
      this.props.loadReportsList({ uuid: nextProps.dataSourceUuid });
      this.props.loadCharacterization({ uuid: nextProps.dataSourceUuid });
    }
  }

  render() {
    return presenter(this.props);
  }
}

class DataCatalogViewEditBuilder {

  getComponent() {
    return StatefulViewEdit;
  }

  mapStateToProps(state, ownProps) {
    const moduleState = get(state, 'dataCatalog');
    const reportsAvailable = get(state, 'dataCatalog.report.queryResult.result', []) || [];
  
    return {
      dataSourceUuid: ownProps.routeParams.dataSourceUuid,
      isLoading: moduleState.dataSource.isLoading || false,
      reportsAvailable,
      isProfileSelected: ownProps.routeParams.isProfile === 'profile',
      name: `${get(moduleState, 'dataSource.data.result.dataNode.name', '')}: ${get(moduleState, 'dataSource.data.result.name', '')}`,
      modelType: get(moduleState, 'dataSource.data.result.modelType', ''),
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
    const uuid = params.dataSourceUuid;
    return {
      loadDataSource: actions.dataCatalog.dataSource.find.bind(null, { uuid }),
      loadReportsList: actions.dataCatalog.report.query.bind(null, { uuid }),
      loadCharacterization: actions.dataCatalog.characterization.find.bind(null, { uuid }),
    };
  }

  build() {
    return Utils.buildConnectedComponent({
      Component: this.getComponent(),
      mapStateToProps: this.mapStateToProps,
      mapDispatchToProps: this.getMapDispatchToProps(),
      getFetchers: this.getFetchers,
    });
  }
}

export default DataCatalogViewEditBuilder;
export {
  StatefulViewEdit,
};
