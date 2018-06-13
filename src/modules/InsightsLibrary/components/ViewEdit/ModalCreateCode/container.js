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
 * Created: July 25, 2017
 *
 */

// @ts-check
import { Utils, get } from 'services/Utils';
import {
  reduxForm,
  reset as resetForm,
} from 'redux-form';
import actions from 'actions';
import { ModalUtils } from 'arachne-ui-components';
import { modals, forms } from 'modules/InsightsLibrary/const';
import FilesUpload from './presenter';

const FormUploadFile = reduxForm({
  form: forms.uploadInsightFile,
})(FilesUpload);

const ModalFormUploadFile = ModalUtils.connect({
  name: modals.insightFile,
})(FormUploadFile);

export default class ModalFormUploadFileBuilder {
  getComponent() {
    return ModalFormUploadFile;
  }

  mapStateToProps(state) {
    const isLoading = get(state, 'insightsLibrary.insights.isLoading', false);
    const files = get(state, `form.${forms.uploadInsightFile}.values.files`, []);

    const formRegisteredFields = get(state, `form.${forms.uploadInsightFile}.registeredFields`, {}, 'Object');
    const fields = get(state, `form.${forms.uploadInsightFile}.registeredFields`, [], 'Array');
    fields.forEach((field) => {
      formRegisteredFields[field.name] = field.type;
    });

    return {
      isLoading,
      insightId: get(state, 'insightsLibrary.insights.data.id', -1),
      canSubmit: files.length > 0,
      type: get(state, `modal.${modals.insightFile}.data.type`, -1),
      formRegisteredFields,
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      closeModal: () => ModalUtils.actions.toggle(modals.insightFile, false),
      loadInsight: actions.insightsLibrary.insights.find,
      uploadFile: actions.insightsLibrary.insightFiles.create,
      reset: () => resetForm(forms.uploadInsightFile),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      doSubmit({ files, link, label }) {
        const promises = [];

        if (!!stateProps.formRegisteredFields.files) {
          files.forEach((file) => {
            promises.push(dispatchProps.uploadFile(
              {
                insightId: stateProps.insightId,
                query: {
                  type: stateProps.type,
                },
              },
              {
                file,
                label: file.label,
              }
            ));
          });
        } else {
          promises.push(dispatchProps.uploadFile(
            {
              insightId: stateProps.insightId,
              query: {
                type: stateProps.type,
              },
            },
            {
              link,
              label,
            }
          ));
        }

        const submitPromise = Promise.all(promises)
          .then(() => dispatchProps.reset())
          .then(() => dispatchProps.closeModal())
          .then(() => dispatchProps.loadInsight({ insightId: stateProps.insightId }));

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