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
 * Created: April 14, 2017
 *
 */

import actions from 'actions/index';
import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { asyncConnect } from 'redux-async-connect';
import presenter from './presenter';
import selectors from './selectors';
import { apply as applySettings } from 'modules/Admin/ducks/systemSettings';
import { ContainerBuilder } from 'services/Utils';

class SystemSettings extends Component {

  static propTypes = {
    loadSystemSettings: PropTypes.func,
  };

  render() {
    return presenter(this.props);
  }
}

class SystemSettingsBuilder extends ContainerBuilder {

  getComponent() {
    return SystemSettings;
  }

  mapStateToProps(state) {
    return {
      isApplied: get(state, 'adminSettings.systemSettings.queryResult.result.applied', true),
      isLoading: state.adminSettings.systemSettings.isLoading || state.adminSettings.solrIndex.isSaving,
      settingGroupList: selectors.getSystemSettings(state),
    };
  }

  getMapDispatchToProps() {
    return {
      loadSystemSettings: actions.adminSettings.systemSettings.query,
      saveData: actions.adminSettings.systemSettings.create,
      applySettings: applySettings,
      solrReindex: actions.adminSettings.solrIndex.create,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      doSubmit: (formName, data) => {
        const submitPromise = dispatchProps.saveData({}, { values: data });

        submitPromise
          .then(dispatchProps.loadSystemSettings)
          .catch(() => {
          });

        return submitPromise;
      },
      applySettings: () => {
        dispatchProps.applySettings(() => dispatchProps.loadSystemSettings());
      }
    };
  }

  getFetchers({ params, state, dispatch }) {
    return {
      promise: actions.adminSettings.systemSettings.query,
    };
  }
}

export default SystemSettingsBuilder;
