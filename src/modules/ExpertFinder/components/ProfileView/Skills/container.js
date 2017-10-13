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
 * Created: January 16, 2017
 *
 */

import actions from 'actions';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { reduxForm, reset as resetForm } from 'redux-form';
import { forms } from 'modules/ExpertFinder/const';
import { Utils } from 'services/Utils';
import Skills from './presenter';

function mapStateToProps(state) {
  const moduleState = state.expertFinder.userProfile;
  const data = get(moduleState, 'data.skills', []);
  const id = get(moduleState, 'data.id', '');
  const editable = get(moduleState, 'data.isEditable', false);
  const isCreating = get(moduleState, 'isLoading', false);
  const skillsDictionary = get(state.expertFinder.skills, 'data', []);

  return {
    id,
    isLoading: get(moduleState, 'isLoading', false),
    items: data,
    skillsDictionary,
    editable,
    isCreating,
  };
}

const mapDispatchToProps = {
  addSkill: actions.expertFinder.userProfile.addSkill,
  removeSkill: actions.expertFinder.userProfile.removeSkill,
  getSkills: actions.expertFinder.skills.getSkillsAutocomplete,
  createSkillAction: actions.expertFinder.skills.createSkill,
  resetForm: () => resetForm(forms.skills),
  loadInfo: actions.expertFinder.userProfile.loadInfo,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    createSkill: function (skill) { // eslint-disable-line object-shorthand
      const createPromise = dispatchProps.createSkillAction(skill)
        .then(res => this.doSubmit({ skill: res.result.id }))
        .catch(() => {});

      return createPromise;
    },
    doSubmit: ({ skill }) => {
      const submitPromise = dispatchProps.addSkill(skill);
      submitPromise.then(() => dispatchProps.resetForm())
        .then(() => dispatchProps.loadInfo(stateProps.id))
        .catch(() => {});

      return submitPromise;
    },
    doRemove: (skill) => {
      Utils.confirmDelete()
        .then(() => {
          dispatchProps.removeSkill(skill).then(() => dispatchProps.loadInfo(stateProps.id));
        });
    },
  };
}

const ReduxFormSkills = reduxForm({
  form: forms.skills,
  enableReinitialize: true,
})(Skills);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxFormSkills);
