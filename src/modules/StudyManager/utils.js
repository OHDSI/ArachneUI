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

class ActiveModuleAwareContainerBuilder extends ContainerBuilder {
  
  initializeKindPromise() {
    this.kindPromise = new Promise((resolve, reject) => {
      this.setKind = resolve;
    });
  }
  
  getId({ params }) {
    return null;
  } 
  
  getType({ params }) {
    return null;
  }

  constructor() {
    super();
    this.initializeKindPromise();
  }
  
  /**
   * @returns { { [x: string]: any } }
   */
  getMapDispatchToProps() {
    return {
      setActiveModule: actions.modules.setActive,
    }
  }
  
  mergeProps(stateProps, dispatchProps, ownProps) {

    return {
      setActiveModule: kind => {
        dispatchProps.setActiveModule(kind === studyKind.WORKSPACE ? 'workspace' : 'study-manager')
      }
    };
  }
  
  getFetchers({ params, dispatch, getState }) {
    let promise;
    if (this.getId({ params }) && this.getType({ params })) {
      promise = dispatch(actions.studyManager.study.studyKind.find({ id: this.getId({ params }), type: this.getType({ params }) }))
        .then(kind => {
          setActiveModuleAccordingToStudyKind({ kind, dispatch});
        });
    } else {
      promise = this.kindPromise
        .then(kind => setActiveModuleAccordingToStudyKind({ kind, dispatch }))
        .then(() => this.initializeKindPromise());
    } 
    return {
      setActiveAccordingToStudyKind: promise,
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
  ActiveModuleAwareContainerBuilder,
  setActiveModuleAccordingToStudyKind
};
