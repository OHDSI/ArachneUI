/*
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
 * Authors: Anton Gackovka
 * Created: July 10, 2018
 */

import { studyKind } from 'modules/StudyManager/const';
import { ContainerBuilder } from 'services/Utils';
import actions from 'actions/index';

class StudyLoadingContainerBuilder extends ContainerBuilder {
  getFetchers({ params, dispatch, getState }) {
    return {
      loadStudy: dispatch(actions.studyManager.study.find({ id: params.studyId }))
        .then(result => {
          if (result.kind === studyKind.WORKSPACE) {
            dispatch(actions.modules.setActive('workspace'));
          } else {
            dispatch(actions.modules.setActive('study-manager'));
          }
        }),
    }
  }
}

function setActiveModuleAccordingToStudyKind({ kind, dispatch }) {
  if (kind === studyKind.WORKSPACE) {
    dispatch(actions.modules.setActive('workspace'));
  } else {
    dispatch(actions.modules.setActive('study-manager'));
  }
}

export {
  StudyLoadingContainerBuilder,
  setActiveModuleAccordingToStudyKind
};
