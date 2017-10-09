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
 * Created: July 03, 2017
 *
 */

import { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { change as reduxFormChange } from 'redux-form';
import { get } from 'services/Utils';
import { form } from 'modules/AnalysisExecution/const';
import presenter from './presenter';
import selectors from './selectors';

class ImportCode extends Component {

  componentWillReceiveProps(nextProps) {
    if (this.props.isOpened !== nextProps.isOpened && nextProps.isOpened === true) {
      this.props.resetSource();
    }
  }

  render() {
    return presenter(this.props);
  }
}

ImportCode.propTypes = {
  isOpened: PropTypes.bool,
  resetSource: PropTypes.func,
};

function mapStateToProps(state) {
  const isOpened = get(state, 'modal.createCode.isOpened', false);

  return {
    selectedSource: get(state, `form.${form.importNodeSelector}.values.dataNode`, null, 'Object'),
    isImportRunning: selectors.isImportRunning(state),
    isImportAvailable: selectors.isImportAvailable(state),
    isOpened,
  };
}

const mapDispatchToProps = {
  resetSource: () => reduxFormChange(form.importNodeSelector, 'dataNode', null),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  //mergeProps
)(ImportCode);
