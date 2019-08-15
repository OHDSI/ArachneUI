/*
 *
 * Copyright 2018 Odysseus Data Services, inc.
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
 * Created: December 21, 2016
 *
 */

import { Component, PropTypes } from 'react';
import { get } from 'services/Utils';
import actions from 'actions';
import { Utils } from 'services/Utils';
import presenter from './presenter';

/** @augments { Component<any, any> } */
class StatefulViewEdit extends Component {
  static propTypes() {
    return {
      dataSourceId: PropTypes.number.isRequired,
      loadDataSource: PropTypes.func.isRequired,
      loadCharacterization: PropTypes.func.isRequired,
      loadAchillesResults: PropTypes.func.isRequired,
      resetDataSource: PropTypes.func.isRequired,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dataSourceId !== nextProps.dataSourceId) {
      this.props.loadDataSource({ id: nextProps.dataSourceId });
      this.props.loadCharacterization({ datasourceId: nextProps.dataSourceId });
      this.props.loadAchillesResults({ datasourceId: nextProps.dataSourceId });
    }
  }

  componentWillUnmount() {
    this.props.resetDataSource();
  }

  render() {
    return presenter(this.props);
  }
}

class CdmSourceListViewEditBuilder {

  getComponent() {
    return StatefulViewEdit;
  }

  mapStateToProps(state, ownProps) {
    const moduleState = state.cdmSourceList;

    return {
      dataSourceId: parseInt(ownProps.routeParams.dataSourceId, 10),
      isLoading: moduleState.dataSource.isLoading || false,
      dataSourceName: get(moduleState, 'dataSource.queryResult.result.name', ''),
      published: get(moduleState, 'dataSource.queryResult.result.published', false),
      modelType: get(moduleState, 'dataSource.queryResult.result.modelType', ''),
    };
  }

  getMapDispatchToProps() {
    return {
      loadDataSource: actions.cdmSourceList.dataSource.query,
      resetDataSource: () => actions.cdmSourceList.dataSource.reset,
    };
  }

  getFetchers({ params, state, dispatch }) {
    const datasourceId = parseInt(params.dataSourceId, 10);
    return {
      loadDataSource: () => actions.cdmSourceList.dataSource.query({ id: datasourceId }),
      loadCharacterization: () => actions.cdmSourceList.characterization.query({ datasourceId }),
      loadAchillesResults: () => actions.cdmSourceList.achillesResults.query({ datasourceId }),
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

export default CdmSourceListViewEditBuilder;
export {
  StatefulViewEdit,
};
