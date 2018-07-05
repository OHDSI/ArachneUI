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
 * Created: April 10, 2017
 *
 */

// @ts-check
import { Utils } from 'services/Utils';
import get from 'lodash/get';
import {
  reduxForm,
  reset as resetForm,
} from 'redux-form';
import actions from 'actions/index';
import { ModalUtils } from 'arachne-ui-components';
import { buildFormData } from 'services/Utils';
import { modal, form } from 'modules/StudyManager/const';
import FilesUpload from './presenter';

const FormFilesUpload = reduxForm({
  form: form.createDocumentFiles,
})(FilesUpload);

export default class FilesUploadBuilder {
  getComponent() {
    return FormFilesUpload;
  }

  mapStateToProps(state) {
    const studyData = get(state, 'studyManager.study.data');
    const files = get(state, `form.${form.createDocumentFiles}.values.files`, []);

    return {
      studyId: get(studyData, 'id'),
      canSubmit: files.length > 0,
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      closeModal: () => ModalUtils.actions.toggle(modal.createDocument, false),
      createDocument: actions.studyManager.study.document.create,
      loadStudy: actions.studyManager.study.find,
      reset: () => resetForm(form.createDocumentFiles),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      doSubmit({ files }) {
        const submitPromises = files.map(file =>
          dispatchProps.createDocument(
            { studyId: stateProps.studyId },
            buildFormData({
              label: file.label,
              file,
            })
          )
        );

        const submitPromise = Promise.all(submitPromises)
          .then(() => dispatchProps.reset())
          .then(() => dispatchProps.closeModal())
          .then(() => dispatchProps.loadStudy({ id: stateProps.studyId }));

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
    });
  }
}
