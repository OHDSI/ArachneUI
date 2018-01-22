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
 * Created: January 16, 2017
 *
 */

import moment from 'moment';
import actions from 'actions';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { reduxForm, reset as resetForm } from 'redux-form';
import { forms, maxDescriptionLength } from 'modules/ExpertFinder/const';
import { Utils } from 'services/Utils';
import Publications from './presenter';

function mapStateToProps(state) {
  const moduleState = state.expertFinder.userProfile;
  const data = get(moduleState, 'data.result.publications', []);
  const id = get(moduleState, 'data.result.id', '');
  const editable = get(moduleState, 'data.result.isEditable', false);
  const selectedDate = get(state, `form.${forms.publications}.values.date`);

  const items = data.map(item => ({ ...item, ...Utils.getSecureLink(item.url) }));

  return {
    id,
    isLoading: get(moduleState, 'isLoading', false),
    items,
    initialValues: {
      date: moment().format('YYYY-MM-DD'),
      description: '',
    },
    editable,
    selectedDate,
  };
}

const mapDispatchToProps = {
  addPublication: actions.expertFinder.userProfile.publications.create,
  removePublication: actions.expertFinder.userProfile.publications.delete,
  resetForm: () => resetForm(forms.publications),
  loadInfo: actions.expertFinder.userProfile.find,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    doSubmit: (data) => {
      const submitPromise = dispatchProps.addPublication(null, data);
      submitPromise.then(() => dispatchProps.resetForm())
        .then(() => dispatchProps.loadInfo({ id: stateProps.id }))
        .catch(() => {});

      return submitPromise;
    },
    doRemove: (publicationId) => {
      Utils.confirmDelete()
        .then(() => {
          dispatchProps.removePublication({ id: publicationId })
            .then(() => dispatchProps.loadInfo({ id: stateProps.id })
          );
        });
    },
  });
}

function showMaxLengthWarning({ description }) {
  const warnings = {};
  if (description && description.length > 0 && description.length < maxDescriptionLength) {
    warnings.description = `Used ${description.length} characters of ${maxDescriptionLength} allowed`;
  }
  return warnings;
}

function checkDescLength({ description }) {
  const errors = {};
  if (description && description.length >= maxDescriptionLength) {
    errors.description = `Used ${description.length} characters of ${maxDescriptionLength} allowed`;
  }
  return errors;
}

const ReduxFormPublications = reduxForm({
  form: forms.publications,
  enableReinitialize: true,
  warn: showMaxLengthWarning,
  validate: checkDescLength,
})(Publications);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxFormPublications);
