/*
 *
 * Copyright 2018 Observational Health Data Sciences and Informatics
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
 * Created: July 03, 2017
 *
 */

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { get } from 'services/Utils';
import actions from 'actions';
import presenter from './presenter';
import selectors from './selectors';

class ImportCode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSource: null,
    };
    this.resetSource = this.resetSource.bind(this);
    this.selectSource = this.selectSource.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isOpened !== nextProps.isOpened && nextProps.isOpened === true) {
      this.props.resetSource();
    }
  }

  resetSource() {
    this.setState({
      selectedSource: null,
    });
  }

  selectSource(selectedSource) {
    this.setState({
      selectedSource,
    });
    this.props.loadList({
      dataNodeId: selectedSource.id,
      type: this.props.analysisType,
    });
  }

  render() {
    return presenter({
      ...this.props,
      ...this.state,
      resetSource: this.resetSource,
      selectSource: this.selectSource,
    });
  }
}

ImportCode.propTypes = {
  isOpened: PropTypes.bool,
  resetSource: PropTypes.func,
  loadList: PropTypes.bool,
  analysisType: PropTypes.string,
};

function mapStateToProps(state) {
  const isOpened = get(state, 'modal.createCode.isOpened', false);
  const analysisType = get(state, 'analysisExecution.analysis.data.result.type.id', '', 'String');

  return {
    isImportRunning: selectors.isImportRunning(state),
    isImportAvailable: selectors.isImportAvailable(state),
    isOpened,
    analysisType,
  };
}

const mapDispatchToProps = {
  loadList: actions.analysisExecution.importEntityOptionList.query,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  //mergeProps
)(ImportCode);
