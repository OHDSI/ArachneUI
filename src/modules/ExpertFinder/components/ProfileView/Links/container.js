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

import { connect } from 'react-redux';
import { reduxForm, reset as resetForm } from 'redux-form';
import get from 'lodash/get';
import actions from 'actions';
import { forms } from 'modules/ExpertFinder/const';
import Links from './presenter';

function mapStateToProps(state) {
  const moduleState = state.expertFinder.userProfile;
  const data = get(moduleState, 'data.links', []);
  const id = get(moduleState, 'data.id', '');
  const editable = get(moduleState, 'data.isEditable', false);

  return {
    id,
    isLoading: get(moduleState, 'isLoading', false),
    items: data,
    editable,
  };
}

const mapDispatchToProps = {
  addLink: actions.expertFinder.userProfile.addLink,
  removeLink: actions.expertFinder.userProfile.removeLink,
  resetForm: () => resetForm(forms.links),
  loadInfo: actions.expertFinder.userProfile.loadInfo,
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    doSubmit: (data) => {
      const submitPromise = dispatchProps.addLink(data);
      submitPromise.then(() => dispatchProps.resetForm())
        .then(() => dispatchProps.loadInfo(stateProps.id))
        .catch(() => {});

      return submitPromise;
    },
    doRemove: (id) => {
      dispatchProps.removeLink(id).then(() => dispatchProps.loadInfo(stateProps.id));
    },
  };
}

const ReduxFormLinks = reduxForm({
  form: forms.links,
  enableReinitialize: true,
})(Links);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxFormLinks);
