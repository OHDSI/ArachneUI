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
 * Created: April 07, 2017
 *
 */

import { Utils, get, buildFormData } from 'services/Utils';
import {
  reset as resetForm,
} from 'redux-form';
import actions from 'actions/index';
import { ModalUtils } from 'arachne-ui-components';
import { modal, form } from 'modules/AnalysisExecution/const';
import FilesUpload from './presenter';

export default class FilesUploadBuilder {
  getComponent() {
    return FilesUpload;
  }

  getFormParams() {
    return {
      form: form.createCodeFiles,
    };
  }

  mapStateToProps(state) {
    const analysisData = get(state, 'analysisExecution.analysis.data.result');
    const files = get(state, `form.${form.createCodeFiles}.values.files`, []);

    return {
      analysisId: get(analysisData, 'id'),
      canSubmit: files.length > 0,
      analysisFiles: get(analysisData, 'files', []),
    };
  }

  getMapDispatchToProps() {
    return {
      closeModal: () => ModalUtils.actions.toggle(modal.createCode, false),
      createCode: actions.analysisExecution.code.create,
      loadAnalysis: actions.analysisExecution.analysis.find,
      reset: () => resetForm(form.createCodeFiles),
      showModalError: params => ModalUtils.actions.toggle(modal.modalError, true, params),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      doSubmit({ files }) {
        let data = [];
        if (Array.isArray(files)) {
          data = data.concat(files);
        }

        const fd = new FormData();
          data.map(file => {
              fd.append("files", file, file.label);
          });

        const submitPromise = dispatchProps.createCode(
            { analysisId: stateProps.analysisId },
            fd
        );

        submitPromise.then(() => dispatchProps.reset())
          .then(() => dispatchProps.closeModal())
          .then(() => dispatchProps.loadAnalysis({ id: stateProps.analysisId }))
          .catch((error) => {
            const errors = get(error, 'errors.file');
            if (errors) {
              dispatchProps.showModalError({
                title: 'Unsuccessful upload',
                errors,
              });
            }
          });

        // We have to return a submission promise back to redux-form
        // to allow it update the state
        return submitPromise;
      },
    };
  }

  build() {
    return Utils.buildConnectedComponent({
      Component: this.getComponent(),
      mapStateToProps: this.mapStateToProps,
      mapDispatchToProps: this.getMapDispatchToProps(),
      mergeProps: this.mergeProps,
      getFormParams: this.getFormParams,
    });
  }
}

