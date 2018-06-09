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
 * Created: June 4, 2018
 */

// @ts-check
import { Utils } from 'services/Utils';
import get from 'lodash/get';
import { ModalUtils } from 'arachne-ui-components';
import actions from 'actions';
import WorkspaceToolbar from './presenter';
import { studyKind } from 'modules/StudyManager/const';

export default class WorkspaceToolbarBuilder {
  getComponent() {
    return WorkspaceToolbar;
  }

  getMapDispatchToProps() {
    return {
      loadWorkspace: actions.studyManager.study.find,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...stateProps,
      ...dispatchProps,
      ...ownProps,
      reload: dispatchProps.loadWorkspace.bind(null, { id: ownProps.toolbarSettings.userId, kind: studyKind.WORKSPACE }),
    };
  }

  build() {
    return Utils.buildConnectedComponent({
      Component: this.getComponent(),
      mapDispatchToProps: this.getMapDispatchToProps(),
      mergeProps: this.mergeProps,
    });
  }
}
