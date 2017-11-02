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
 * Created: January 26, 2017
 *
 */

// @ts-check
import actions from 'actions';
import { Utils, get } from 'services/Utils';
import ToolbarActions from './presenter';
import { push as goToPage } from 'react-router-redux';

class DataCatalogListActionsBuilder {

  getComponent() {
    return ToolbarActions;
  }

  mapStateToProps(state) {
    const cleanPath = get(state, 'routing.locationBeforeTransitions.pathname');
    return {
      currentQuery: state.routing.locationBeforeTransitions.query,
      cleanPath
    };
  }

  /**
   * @returns { { [x: string]: any } }
   */
  getMapDispatchToProps() {
    return {
      loadDsList: actions.dataCatalog.dataSourceList.query,
      go: address => goToPage(address),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      reload: () => {
        dispatchProps.go(Utils.getHref(stateProps.cleanPath, stateProps.currentQuery, true))
      },
    };
  }

  build() {
    return Utils.buildConnectedComponent({
      Component: this.getComponent(),
      mapStateToProps: this.mapStateToProps,
      mapDispatchToProps: this.getMapDispatchToProps(),
      mergeProps: this.mergeProps,
    });
  }
}

export default DataCatalogListActionsBuilder;
