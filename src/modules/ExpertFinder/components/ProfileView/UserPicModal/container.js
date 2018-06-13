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
import { Component } from 'react';
import { connect } from 'react-redux';
import { ModalUtils } from 'arachne-ui-components';
import { reduxForm, reset as resetForm } from 'redux-form';
import get from 'lodash/get';
import { forms, modal } from 'modules/ExpertFinder/const';
import presenter from './presenter';

class UserPicModal extends Component {
  componentWillMount() {

  }

  render() {
    return presenter(this.props);
  }
}

function mapStateToProps(state) {
  const moduleState = state.expertFinder.userProfile;
  const userId = get(moduleState, 'data.result.id', '');
  return {
    userId,
  };
}

const mapDispatchToProps = {
  updateUserpic: actions.expertFinder.userProfile.userPic.update,
  resetForm: () => resetForm(forms.userPic),
  loadInfo: actions.expertFinder.userProfile.find,
  clearInfo: actions.expertFinder.userProfile.clear,
  hideUploadForm: () => ModalUtils.actions.toggle(modal.userPic, false),
};

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    doSubmit: ({ image }) => {
      const data = new FormData();
      data.append('file', image[0]);

      const submitPromise = dispatchProps.updateUserpic(
        { id: stateProps.userId },
        data
      );
      submitPromise.then(() => dispatchProps.resetForm())
        .then(() => dispatchProps.clearInfo())
        .then(() => dispatchProps.loadInfo({
          id: stateProps.userId,
        }))
        .then(() => dispatchProps.hideUploadForm())
        .catch(() => {});

      return submitPromise;
    },
  });
}

let ReduxModalWindow = reduxForm({ form: forms.userPic })(UserPicModal);
ReduxModalWindow = ModalUtils.connect({ name: modal.userPic })(ReduxModalWindow);

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ReduxModalWindow);
