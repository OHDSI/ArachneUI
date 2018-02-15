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
 * Created: December 21, 2016
 *
 */

import { Component, PropTypes } from 'react';
import get from 'lodash/get';
import actions from 'actions';
import { Utils } from 'services/Utils';
import presenter from './presenter';

/** @augments { Component<any, any> } */
class StatefulViewEdit extends Component {
  static propTypes() {
    return {
      dataSourceId: PropTypes.number.isRequired,
      loadDataSourceBusiness: PropTypes.func.isRequired,
      loadCharacterization: PropTypes.func.isRequired,
      loadAchillesResults: PropTypes.func.isRequired,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dataSourceId !== nextProps.dataSourceId) {
      this.props.loadDataSourceBusiness({ id: nextProps.dataSourceId });
      this.props.loadCharacterization({ datasourceId: nextProps.dataSourceId });
      this.props.loadAchillesResults({ datasourceId: nextProps.dataSourceId });
    }
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
      isLoading: moduleState.dataSourceBusiness.isLoading || false,
      dataSourceName: get(moduleState, 'dataSourceBusiness.queryResult.result.name', ''),
      isPublished: get(moduleState, 'dataSourceBusiness.queryResult.result.isPublished', false),
      modelType: get(moduleState, 'dataSourceBusiness.queryResult.result.modelType', ''),
    };
  }

  getMapDispatchToProps() {
    return {
      loadDataSourceBusiness: actions.cdmSourceList.dataSourceBusiness.query,
    };
  }

  getFetchers({ params, state, dispatch }) {
    const datasourceId = parseInt(params.dataSourceId, 10);
    return {
      loadDataSourceBusiness: () => actions.cdmSourceList.dataSourceBusiness.query({ id: datasourceId }),
      loadCharacterization: () => actions.cdmSourceList.characterization.query({ datasourceId: datasourceId }),
      loadAchillesResults: () => actions.cdmSourceList.achillesResults.query({ datasourceId: datasourceId }),
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
