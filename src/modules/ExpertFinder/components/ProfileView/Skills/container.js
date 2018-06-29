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
  const moduleState = state.expertFinder;
  const data = get(moduleState, 'userProfile.data.result.skills', []);
  const id = get(moduleState, 'userProfile.data.result.id', '');
  const editable = get(moduleState, 'userProfile.data.result.isEditable', false);
  const isCreating = get(moduleState, 'skills.isSaving', false);
  const isLoading = get(moduleState, 'skills.isLoading', false);
  const skillsDictionary = get(moduleState, 'skills.queryResult.result', []);

  return {
    id,
    isLoading: isLoading || isCreating,
    items: data,
    skillsDictionary,
    editable,
    isCreating,
  };
}

const mapDispatchToProps = {
  addSkill: actions.expertFinder.skills.add,
  removeSkill: actions.expertFinder.skills.delete,
  getSkills: actions.expertFinder.skills.query,
  createSkillAction: actions.expertFinder.skills.create,
  resetForm: () => resetForm(forms.skills),
  loadInfo: actions.expertFinder.userProfile.find,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    createSkill: function (skill) { // eslint-disable-line object-shorthand
      const createPromise = dispatchProps.createSkillAction(null, {
        id: null,
        name: skill.value,
      })
        .then(res => this.doSubmit({ skill: res.result.id }))
        .catch(() => {});

      return createPromise;
    },
    doSubmit: ({ skill }) => {
      const submitPromise = dispatchProps.addSkill({ id: skill });
      submitPromise.then(() => dispatchProps.resetForm())
        .then(() => dispatchProps.loadInfo({ id: stateProps.id }))
        .then(() => dispatchProps.getSkills())
        .catch(() => {});

      return submitPromise;
    },
    doRemove: (id, name) => {
      Utils.confirmDelete({
        message: `Are you sure you want to delete '${name}'?`,
      })
        .then(() => {
          dispatchProps
            .removeSkill({ id })
            .then(() => dispatchProps.loadInfo({ id: stateProps.id }))
            .then(() => dispatchProps.getSkills());
        });
    },
  };
}

const ReduxFormSkills = reduxForm({
  form: forms.skills,
  enableReinitialize: true,
})(Skills);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxFormSkills);
