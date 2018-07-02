/*
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
 * Authors: Anton Gackovka
 * Created: June 15, 2018
 */

import { connect } from 'react-redux';
import actions from 'actions/index';
import { ModalUtils } from 'arachne-ui-components';
import { modal, form } from 'modules/AnalysisExecution/const';
import ModalEditFileName from './presenter';
import { ContainerBuilder, get } from 'services/Utils';
import { isFat as isMimeTypeFat } from 'services/MimeTypeUtil';

class ModalEditFileNameBuilder extends ContainerBuilder {
  
  getComponent() {
    return ModalEditFileName;
  }
  
  mapStateToProps(state) {
    const fileData = get(state, 'analysisExecution.analysisCode.data.result', {});
    return {
      analysisId: get(fileData, 'analysisId'),
      fileUuid: get(fileData, 'uuid'),
      mimeType: get(fileData, 'docType', null, 'String'),
      initialValues: {
        name: get(fileData, 'label'),
      },
    };
  }

  getMapDispatchToProps() {
    return {
      updateAnalysisFile: actions.analysisExecution.analysisCode.update,
      loadAnalysisCode: actions.analysisExecution.analysisCode.find,
      closeModal: () => ModalUtils.actions.toggle(modal.editFileName, false),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      async doSubmit({ name }) {
        await dispatchProps.updateAnalysisFile(
          { analysisId: stateProps.analysisId, analysisCodeId: stateProps.fileUuid },
          { name },
          false
        );
        dispatchProps.closeModal();
        dispatchProps.loadAnalysisCode({
          analysisId: stateProps.analysisId,
          analysisCodeId: stateProps.fileUuid,
          withContent: !isMimeTypeFat(stateProps.mimeType),
        });
      },
    };
  }

  getModalParams() {
    return {
      name: modal.editFileName,
    }
  }

  getFormParams() {
    return {
      form: form.editFileName,
      enableReinitialize: true,
    }
  }
}

export default ModalEditFileNameBuilder;
