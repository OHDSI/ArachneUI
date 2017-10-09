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
 * Created: December 13, 2016
 *
 */

// @ts-check
import { reduxForm } from 'redux-form';
import { Utils } from 'services/Utils';
import get from 'lodash/get';
import actions from 'actions/index';
import { ModalUtils } from 'arachne-ui-components';
import { modal, form, paths } from 'modules/StudyManager/const';
import { push as goToPage } from 'react-router-redux';
import ModalCreateAnalysis from './presenter';
import SelectorsBuilder from './selectors';

const selectors = (new SelectorsBuilder()).build();

let ReduxModalCreateAnalysis = reduxForm({
  form: form.createAnalysis,
})(ModalCreateAnalysis);

ReduxModalCreateAnalysis = ModalUtils.connect({
  name: modal.createAnalysis,
})(ReduxModalCreateAnalysis);

export default class ModalCreateAnalysisBuilder {
  getComponent() {
    return ReduxModalCreateAnalysis;
  }

  mapStateToProps(state) {
    const moduleData = get(state, 'studyManager');
    return {
      studyId: get(moduleData, 'study.data.result.id'),
      analysisTypes: selectors.getAnalysisTypesList(state),
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      createAnalysis: actions.studyManager.analyses.create,
      showAnalysis: id => goToPage(paths.analyses(id)),
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      doSubmit({ title, typeId }) {
        const submitPromise = dispatchProps.createAnalysis(null, {
          title,
          typeId,
          studyId: stateProps.studyId,
        });

        submitPromise
          .then(({ result }) => {
            return dispatchProps.showAnalysis(result.id);
          })
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
