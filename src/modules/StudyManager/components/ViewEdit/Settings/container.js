/*
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
import { Utils } from 'services/Utils';
import get from 'lodash/get';
import actions from 'actions/index';
import { studyPermissions } from 'modules/StudyManager/const';
import StudySettings from './presenter';
import SelectorsBuilder from './selectors';

const selectors = (new SelectorsBuilder()).build();

export default class StudySettingsBuilder {
  getComponent() {
    return StudySettings;
  }

  static getSelectedOption(options, value) {
    // NOTE: initial value of input should not be null
    // otherwise React will mark input as uncontrolled
    return options.filter(o => o.value === value)[0] || { value: '' };
  }

  mapStateToProps(state) {
    const studyState = get(state, 'studyManager.study.data.result');

    const typeOptions = selectors.getTypeOptions(state);
    const statusOptions = selectors.getStatusOptions(state);

    return {
      studyId: get(studyState, 'id'),
      isEditable: get(studyState, `permissions[${studyPermissions.editStudy}]`, false),

      typeOptions,
      typeSelected: StudySettingsBuilder.getSelectedOption(
        typeOptions,
        get(studyState, 'type.id')
      ),

      statusOptions,
      statusSelected: StudySettingsBuilder.getSelectedOption(
        statusOptions,
        get(studyState, 'status.id')
      ),
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      load: actions.studyManager.study.find,
      loadTransitions: actions.studyManager.availableTransitions.query,
      updateStudy: actions.studyManager.study.update,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      setType: (type) => {
        dispatchProps
          .updateStudy(stateProps.studyId, {
            type: {
              id: type,
            },
          })
          .then(() => dispatchProps.load(stateProps.studyId));
      },
      setStatus: (status) => {
        dispatchProps
          .updateStudy(stateProps.studyId, {
            status: {
              id: status,
            },
          })
          .then(() => {
            dispatchProps.load(stateProps.studyId);
            dispatchProps.loadTransitions({ studyId: stateProps.studyId });
          });
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
