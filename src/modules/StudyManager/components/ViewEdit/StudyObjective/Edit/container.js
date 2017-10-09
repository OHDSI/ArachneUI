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
import { Component } from 'react';
import { Utils } from 'services/Utils';
import { reduxForm } from 'redux-form';
import get from 'lodash/get';
import actions from 'actions/index';
import presenter from './presenter';

class StudyObjectiveEdit extends Component {
  constructor() {
    super();
    this.setTextarea = this.setTextarea.bind(this);
  }

  componentDidMount() {
    if (this.textarea) {
      this.textarea.focus();
    }
  }

  setTextarea(textarea) {
    this.textarea = textarea;
  }

  render() {
    return presenter({
      ...this.props,
      setTextarea: this.setTextarea,
    });
  }
}

const ReduxStudyObjectiveEdit = reduxForm({
  form: 'studyObjective',
  enableReinitialize: true,
})(StudyObjectiveEdit);

export default class StudyObjectiveEditBuilder {
  getComponent() {
    return ReduxStudyObjectiveEdit;
  }

  mapStateToProps(state) {
    const studyData = get(state, 'studyManager.study.data.result');

    return {
      studyId: get(studyData, 'id'),
      initialValues: {
        description: get(studyData, 'description'),
      },
    };
  }

  getMapDispatchToProps() {
    return {
      load: actions.studyManager.study.find,
      updateStudy: actions.studyManager.study.update,
    };
  }

  mergeProps(stateProps, dispatchProps, ownProps) {
    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      setDescr: ({ description }) => dispatchProps
        .updateStudy(stateProps.studyId, { description })
        .then(() => dispatchProps.load(stateProps.studyId))
        .then(ownProps.setViewMode),
      cancel: () => ownProps.setViewMode(),
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
