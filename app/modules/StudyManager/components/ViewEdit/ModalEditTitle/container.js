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
 * Created: December 16, 2016
 *
 */

// @ts-check
import { Utils } from 'services/Utils';
import { reduxForm } from 'redux-form';
import get from 'lodash/get';
import actions from 'actions/index';
import { ModalUtils } from 'arachne-components';
import { modal, form } from 'modules/StudyManager/const';
import ModalEditTitle from './presenter';

let ReduxModalEditTitle = ModalUtils.connect({
  name: modal.editStudyTitle,
})(ModalEditTitle);

ReduxModalEditTitle = reduxForm({
  form: form.editStudyTitle,
  enableReinitialize: true,
})(ReduxModalEditTitle);

export default class ModalEditTitleBuilder {
  getComponent() {
    return ReduxModalEditTitle;
  }

  mapStateToProps(state) {
    const studyData = get(state, 'studyManager.study.data.result');
    return {
      studyId: get(studyData, 'id'),
      initialValues: {
        title: get(studyData, 'title'),
      },
    };
  }

  getMapDispatchToProps() {
    return {
      updateStudy: actions.studyManager.study.update,
      closeModal: () => ModalUtils.actions.toggle(modal.editStudyTitle, false),
      loadStudy: actions.studyManager.study.find,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      doSubmit({ title }) {
        const submitPromise = dispatchProps.updateStudy(
          stateProps.studyId,
          { title },
          false
        );

        submitPromise
          .then(() => dispatchProps.closeModal())
          .then(() => dispatchProps.loadStudy(stateProps.studyId))
          .catch(() => {});

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
