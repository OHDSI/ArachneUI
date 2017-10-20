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
 * Created: June 14, 2017
 *
 */

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import actions from 'actions/index';
import { characterizationStatuses, pollTime } from 'modules/CdmSourceList/const';
import presenter from './presenter';
import selectors from './selectors';

class Characterization extends Component {
  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isCharacterizationStarted !== nextProps.isCharacterizationStarted) {
      if (this.poll) {
        clearInterval(this.poll);
      }
      if (nextProps.isCharacterizationStarted) {
        this.poll = setInterval(
          this.props.loadCharacterization,
          pollTime,
          { datasourceId: nextProps.datasourceId }
        );
      }      
    }
  }

  componentWillUnmount() {
    if (this.poll) {
      clearInterval(this.poll);
    }
  }

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state) {
  const datasourceId = get(state, 'cdmSourceList.dataSourceBusiness.data.id');
  const characterizationStatus = get(state, 'cdmSourceList.characterization.data.content[0].status');
  const characterizationSource = get(state, 'cdmSourceList.characterization.data.content[0].source');
  const thisCharacterization = get(state, 'cdmSourceList.characterization.data.content[0].finished', null);
  const prevCharacterization = get(state, 'cdmSourceList.characterization.data.content[1].finished', null);
  const hasResults = get(state, 'cdmSourceList.achillesResults.data');
  const isCharacterizationStarted = characterizationStatus === characterizationStatuses.IN_PROGRESS
    || get(state, 'cdmSourceList.characterization.isLoading', false);

  return {
    datasourceId,
    isCharacterizationStarted,
    lastCharacterization: thisCharacterization || prevCharacterization,
    hasResults,
    characterizationSource,
  };
}

const mapDispatchToProps = {
  updateCharacterization: actions.cdmSourceList.characterization.update,
  loadCharacterization: params => actions.cdmSourceList.characterization.load({ ...params, limit: 2 }),
  loadResults: actions.cdmSourceList.achillesResults.load,
  doImportResults: actions.cdmSourceList.achillesResults.update,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    update: () => {
      dispatchProps.updateCharacterization({ datasourceId: stateProps.datasourceId })
        .then(() => dispatchProps.loadCharacterization({ datasourceId: stateProps.datasourceId }));
    },
    importResults: () => {
      dispatchProps.doImportResults({ datasourceId: stateProps.datasourceId })
        .then(() => dispatchProps.loadCharacterization({ datasourceId: stateProps.datasourceId }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(Characterization);
