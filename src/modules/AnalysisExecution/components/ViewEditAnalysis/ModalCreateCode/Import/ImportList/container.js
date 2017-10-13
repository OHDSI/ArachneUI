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
 * Created: July 26, 2017
 *
 */

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  reduxForm,
  reset as resetForm,
} from 'redux-form';
import { ModalUtils } from 'arachne-ui-components';
import { get, getFormSelectedCheckboxes } from 'services/Utils';
import actions from 'actions';
import { form, modal } from 'modules/AnalysisExecution/const';
import presenter from './presenter';
import selectors from './selectors';

class ImportList extends Component {
  constructor() {
    super();
    this.state = {
      filterText: '',
    };
    this.filter = this.filter.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selectedSource.uuid !== nextProps.selectedSource.uuid &&
      !!nextProps.selectedSource.uuid
    ) {
      this.props.loadList({
        dataNodeUuid: nextProps.selectedSource.uuid,
        type: this.props.analysisType,
      });
    }
  }

  filter(filterText) {
    this.setState({
      filterText,
    });
  }

  render() {
    return presenter({
      ...this.props,
      ...this.state,
      filter: this.filter,
    });
  }
}

ImportList.propTypes = {
  selectedSource: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  loadList: PropTypes.func,
  analysisType: PropTypes.string,
};

function mapStateToProps(state, ownProps) {
  const analysisType = get(state, 'analysisExecution.analysis.data.result.type.id', '', 'String');
  const selectedSource = get(ownProps, 'selectedSource', {}, 'Object');

  return {
    selectedSource,
    isAnySelected: selectors.getSelectedForImport(state).length > 0,
    entities: selectors.getList(state),
    totalSteps: ownProps.totalSteps,
    step: ownProps.step,
    goBack: ownProps.goBack,
    analysisId: get(state, 'analysisExecution.analysis.data.result.id', 'Number'),
    analysisType,
  };
}

const mapDispatchToProps = {
  loadList: actions.analysisExecution.importEntityOptionList.query,
  importEntities: actions.analysisExecution.importEntity.create,
  closeModal: () => ModalUtils.actions.toggle(modal.createCode, false),
  loadAnalysis: actions.analysisExecution.analysis.find,
  reset: () => resetForm(form.importCodeList),
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    doSubmit({ entities }) {
      // TEMP. TODO!
      const datanodeSid = stateProps.selectedSource.uuid;
      const entityGuid = getFormSelectedCheckboxes(entities)[0];

      const submitPromise = dispatchProps.importEntities(
        {
          analysisId: stateProps.analysisId,
          type: stateProps.analysisType,
        },
        {
          datanodeSid,
          entityGuid,
        }
      );

      submitPromise.then(() => dispatchProps.reset())
        .then(() => dispatchProps.closeModal())
        .then(() => dispatchProps.loadAnalysis({ id: stateProps.analysisId }));

      return submitPromise;
    },
  };
}

const ReduxImportList = reduxForm({
  form: form.importCodeList,
})(ImportList);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ReduxImportList);
