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
 * Created: December 13, 2016
 *
 */

// @ts-check
import { Utils } from 'services/Utils';
import get from 'lodash/get';
import actions from 'actions/index';
import { studyPermissions } from 'modules/StudyManager/const';
import DateInterval from './presenter';

export default class DateIntervalBuilder {
  getComponent() {
    return DateInterval;
  }

  mapStateToProps(state) {
    const studyData = get(state, 'studyManager.study.data.result');

    return {
      studyId: get(studyData, 'id'),
      startDate: get(studyData, 'startDate') || get(studyData, 'created'),
      endDate: get(studyData, 'endDate'),
      isEditable: get(studyData, `permissions[${studyPermissions.editStudy}]`, false),
    };
  }

  /**
  * @returns { { [x: string]: any } }
  */
  getMapDispatchToProps() {
    return {
      load: actions.studyManager.study.find,
      updateStudy: actions.studyManager.study.update,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return Object.assign({
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      setStartDate: (startDate) => {
        dispatchProps
          .updateStudy(stateProps.studyId, { startDate })
          .then(() => dispatchProps.load(stateProps.studyId));
      },
      setEndDate: (endDate) => {
        dispatchProps
          .updateStudy(stateProps.studyId, { endDate })
          .then(() => dispatchProps.load(stateProps.studyId));
      },
    });
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
