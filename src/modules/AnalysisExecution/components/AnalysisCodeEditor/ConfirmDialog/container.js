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
 * Created: February 08, 2017
 *
 */

import { get } from 'services/Utils';
import { ModalUtils } from 'arachne-ui-components';
import { connect } from 'react-redux';
import { modal, paths } from 'modules/AnalysisExecution/const';
import { push as goToPage } from 'react-router-redux';
import ConfirmDialog from './presenter';

function mapStateToProps(state) {
  return {
    analysisId: get(state, 'modal.confirmDialog.data.analysisId'),
  };
}

const mapDispatchToProps = {
  goToAnalysisPage: id => goToPage.call(null, paths.analyses(id)),
  hideConfirmDialog: () => ModalUtils.actions.toggle(modal.confirmDialog, false),
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToAnalysis: () => dispatchProps.goToAnalysisPage(stateProps.analysisId),
  };
}

const ModalConfirmDialog = ModalUtils.connect({
  name: modal.confirmDialog,
})(ConfirmDialog);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ModalConfirmDialog);
